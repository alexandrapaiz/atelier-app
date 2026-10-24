#!/usr/bin/env bash
#
# check-seat-surface.sh — does the surface this product declares for a seat
# still execute that seat?
#
# company.yaml names one file per seat under .github/workflows/ and calls it the
# seat. Everything the org knows about where a seat runs is read off that
# declaration: an exo seat that adds a post-run step edits those files, a drift
# check greps them, a chair reads them to say what a seat does. None of that is
# evidence that the file ran. A seat can be executed by something else entirely
# while its declared workflow sits untouched and green-by-never-running, and
# that gap is silent by construction, because both surfaces report success
# (standards/lessons.md L-A16: configured is not in effect; L-A72: a declaration
# in the repository is not a fact about the running system).
#
# So this compares two readings of the same seat and never infers either:
#   declared — the newest GitHub Actions run of the workflow file company.yaml
#              names, read with `gh run list --workflow=<file>`
#   actual   — the newest run the board recorded for that seat, with the host
#              that served it, read from GET /api/board/<company>
#
# Usage:
#   tools/check-seat-surface.sh                  every seat named in company.yaml
#   tools/check-seat-surface.sh --seat engineer  one seat
#   tools/check-seat-surface.sh --company atelier  override the board company name
#
# One line per seat, fields stable enough to grep:
#   ELSEWHERE seat=engineer declared=.github/workflows/agent-engineer.yml
#             declared_last=2026-09-19 actual_last=2026-10-24 gap=35d
#             actual_surface=host.alexandra-systems-company.com trigger=window:message
#
# AGREE      the seat's newest recorded run was served by its declared workflow,
#            so an edit to that file reaches the next run.
# ELSEWHERE  the seat's newest recorded run was served by something else, and the
#            declared workflow has not run since. An edit to that file reaches
#            nothing. gap= is how far apart the two readings are.
# NEVER      the declared workflow has no Actions run at all, ever.
# QUIET      neither surface has a run to compare. Not a pass: nothing executed
#            this seat, so nothing proved where it would.
# unreadable a field could not be read. The seat is reported, never silently
#            dropped, and the exit status is 2 (L-A44: the cause rides with the
#            value; L-A80: a read that succeeds with nothing in it is not a
#            reading).
#
# Exit status:
#   0  every seat in scope ran last on its declared surface (all AGREE)
#   1  at least one seat runs somewhere its declaration does not name, so an
#      edit to the declared file would reach nothing — named on stdout
#   2  the check could not run, or could not read a field it needed. Never read
#      a 2 as a 0: "I could not look" and "nothing is wrong" are different
#      answers and only one is safe to act on.
#
# Requires: git, gh (authenticated), curl, and BOARD_API_URL + BOARD_RUNTIME_TOKEN
# in the environment (names only — this never prints a token, L-X5). No npm
# dependencies, per this app's zero-framework ethos.

set -euo pipefail

scope=seats
seat=
company=
while [ $# -gt 0 ]; do
  case "$1" in
    --seat)    scope=one; seat="${2:-}"; shift 2 ;;
    --company) company="${2:-}"; shift 2 ;;
    -h|--help) sed -n '2,57p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "check-seat-surface: unknown argument: $1" >&2; exit 2 ;;
  esac
done
[ "$scope" = one ] && [ -z "$seat" ] && { echo "check-seat-surface: --seat needs a name" >&2; exit 2; }

command -v gh >/dev/null 2>&1 || { echo "check-seat-surface: gh is not installed" >&2; exit 2; }
command -v curl >/dev/null 2>&1 || { echo "check-seat-surface: curl is not installed" >&2; exit 2; }
git rev-parse --git-dir >/dev/null 2>&1 || { echo "check-seat-surface: not a git repository" >&2; exit 2; }
gh auth status >/dev/null 2>&1 || { echo "check-seat-surface: gh is not authenticated" >&2; exit 2; }

root=$(git rev-parse --show-toplevel)
manifest="$root/company.yaml"
[ -f "$manifest" ] || { echo "check-seat-surface: no company.yaml, so this product declares no seats" >&2; exit 2; }

# The board's company name is the product name, not the repository name: this
# repo is atelier-app and its board company is atelier (standards/pm.md §14
# lists the names, and they are the repo names everywhere except here). Read it
# off the manifest rather than off the remote, and let --company override.
[ -n "$company" ] || company=$(sed -n 's/^product: *\([a-z0-9-]*\).*/\1/p' "$manifest")
[ -n "$company" ] || { echo "check-seat-surface: company.yaml names no product; pass --company" >&2; exit 2; }

: "${BOARD_API_URL:?check-seat-surface: BOARD_API_URL is not set, so the actual surface cannot be read}"
: "${BOARD_RUNTIME_TOKEN:?check-seat-surface: BOARD_RUNTIME_TOKEN is not set, so the actual surface cannot be read}"

# One board read for every seat, because the endpoint returns the whole roster of
# recent runs and a read per seat would just page the same rows again.
if ! board=$(curl -sS --fail-with-body -m 30 \
      -H "Authorization: Bearer $BOARD_RUNTIME_TOKEN" \
      "$BOARD_API_URL/api/board/$company" 2>&1); then
  echo "check-seat-surface: could not read the board for '$company'" >&2
  exit 2
fi
# An empty runs array is a reading; a body that is not the board at all is not.
echo "$board" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const b=JSON.parse(s);if(!Array.isArray(b.runs))process.exit(1)})' 2>/dev/null || {
  echo "check-seat-surface: the board answered for '$company' without a runs array" >&2; exit 2; }

seats=()
case "$scope" in
  one)   seats=("$seat") ;;
  seats) while IFS= read -r line; do seats+=("$line"); done < <(
           sed -n 's/^  - *{ *name: *\([a-z0-9-]*\).*/\1/p' "$manifest")
         [ ${#seats[@]} -eq 0 ] && { echo "check-seat-surface: company.yaml named no seats" >&2; exit 2; } ;;
esac

# The workflow file the manifest names for a seat. A seat declared without one
# is reported as unreadable rather than skipped.
declared_workflow() { # seat
  sed -n "s/^  - *{ *name: *$1 *,.*workflow: *\([^ ,}]*\).*/\1/p" "$manifest" | head -1
}

# The newest board run for a seat, as: started_at<TAB>run_url<TAB>trigger
board_last() { # seat
  echo "$board" | node -e '
    let s=""; process.stdin.on("data",d=>s+=d).on("end",()=>{
      const seat = process.argv[1];
      const runs = (JSON.parse(s).runs || [])
        .filter(r => r.seat === seat)
        .sort((a,b) => String(b.started_at).localeCompare(String(a.started_at)));
      if (!runs.length) { process.exit(0); }
      const r = runs[0];
      process.stdout.write([r.started_at || "", r.run_url || "", r.trigger || ""].join("\t"));
    });' "$1"
}

host_of() { # url
  case "$1" in
    "") echo none ;;
    *) echo "$1" | sed -n 's|^[a-z]*://\([^/]*\)/.*|\1|p' ;;
  esac
}

day_of() { # iso timestamp
  case "$1" in "") echo none ;; *) echo "${1%%T*}" ;; esac
}

days_between() { # iso iso
  local a b
  a=$(date -u -d "${1%%+*}" +%s 2>/dev/null) || { echo unreadable; return; }
  b=$(date -u -d "${2%%+*}" +%s 2>/dev/null) || { echo unreadable; return; }
  echo "$(( (b > a ? b - a : a - b) / 86400 ))d"
}

elsewhere=0
unreadable=0
checked=0

for s in "${seats[@]}"; do
  checked=$((checked + 1))
  wf=$(declared_workflow "$s")
  if [ -z "$wf" ]; then
    printf 'unreadable seat=%s declared=none (company.yaml declares this seat with no workflow)\n' "$s"
    unreadable=$((unreadable + 1))
    continue
  fi

  # `gh run list --workflow=` takes the file's basename. A workflow that has
  # never run answers with an empty list, which is a reading; a failed call is
  # not, and the two must not print the same thing.
  if dl=$(gh run list --workflow="$(basename "$wf")" --limit 1 \
            --json createdAt,url,event --jq '.[0] | [.createdAt, .url, .event] | @tsv' 2>/dev/null); then
    IFS=$'\t' read -r d_at d_url d_event <<<"${dl:-}"
  else
    d_at=unreadable; d_url=; d_event=
  fi

  if bl=$(board_last "$s"); then
    IFS=$'\t' read -r b_at b_url b_trigger <<<"${bl:-}"
  else
    b_at=unreadable; b_url=; b_trigger=
  fi

  if [ "$d_at" = unreadable ] || [ "$b_at" = unreadable ]; then
    printf 'unreadable seat=%s declared=%s declared_last=%s actual_last=%s\n' \
      "$s" "$wf" "${d_at:-unreadable}" "${b_at:-unreadable}"
    unreadable=$((unreadable + 1))
    continue
  fi

  b_host=$(host_of "${b_url:-}")

  if [ -z "${d_at:-}" ] && [ -z "${b_at:-}" ]; then
    printf 'QUIET     seat=%s declared=%s declared_last=none actual_last=none\n' "$s" "$wf"
    unreadable=$((unreadable + 1))
    continue
  fi

  # The board records a GitHub Actions run under the same host as the API that
  # served it, so agreement is decided on the host of the newest actual run:
  # github.com means the declared workflow is what ran.
  if [ -n "${b_at:-}" ] && [ "$b_host" != "github.com" ]; then
    gap=unreadable
    [ -n "${d_at:-}" ] && gap=$(days_between "$d_at" "$b_at")
    printf 'ELSEWHERE seat=%s declared=%s declared_last=%s actual_last=%s gap=%s actual_surface=%s trigger=%s\n' \
      "$s" "$wf" "$(day_of "${d_at:-}")" "$(day_of "$b_at")" "$gap" "$b_host" "${b_trigger:-none}"
    elsewhere=$((elsewhere + 1))
    continue
  fi

  if [ -z "${d_at:-}" ]; then
    printf 'NEVER     seat=%s declared=%s declared_last=none actual_last=%s actual_surface=%s\n' \
      "$s" "$wf" "$(day_of "${b_at:-}")" "$b_host"
    elsewhere=$((elsewhere + 1))
    continue
  fi

  printf 'AGREE     seat=%s declared=%s declared_last=%s actual_last=%s event=%s\n' \
    "$s" "$wf" "$(day_of "$d_at")" "$(day_of "${b_at:-}")" "${d_event:-none}"
done

if [ "$unreadable" -gt 0 ]; then
  echo "check-seat-surface: $unreadable of $checked seat(s) could not be read. That is not a pass."
  exit 2
fi
if [ "$elsewhere" -gt 0 ]; then
  echo "check-seat-surface: $elsewhere of $checked seat(s) run somewhere company.yaml does not name — an edit to the declared workflow reaches nothing (L-A16)."
  exit 1
fi
echo "check-seat-surface: $checked seat(s) in scope, each last run by the surface it declares."
exit 0
