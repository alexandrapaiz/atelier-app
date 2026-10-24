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
#              that served it, read from GET /api/board/<company>. That route
#              returns at most 25 runs, says nothing about having truncated,
#              and 404s on any query string, so there is no way to ask it for a
#              wider window. A seat missing from the page therefore proves only
#              that it did not run inside the page, and every line that had no
#              board run for its seat prints board_window_from= so a reader can
#              see which question was actually answered (L-A87).
#   forge    — the newest pull request opened from a branch carrying the seat's
#              name, which is the weakest of the three and the only one left
#              when the board recorded nothing. Every line names the reading it
#              decided on, in source=, because a verdict from a weaker source is
#              a different answer and not a quieter one.
#
# Usage:
#   tools/check-seat-surface.sh                  every seat named in company.yaml
#   tools/check-seat-surface.sh --seat engineer  one seat
#   tools/check-seat-surface.sh --company atelier  override the board company name
#
# One line per seat, fields stable enough to grep:
#   ELSEWHERE seat=engineer declared=.github/workflows/agent-engineer.yml
#             declared_last=2026-09-19 actual_last=2026-10-24 gap=34d
#             actual_surface=host.alexandra-systems-company.com trigger=window:message
#             source=board board_runs=3
#
# A seat's run reaches the board when it ENDS, not when it starts, so a seat
# absent from the board is the normal state for the whole duration of its own
# run. Measured here the hard way: this tool read board_runs=0 for the exo seat
# at 18:20 and called it a missed run, and the run had started at 18:07 and
# ended at 18:24. A fresh absence and a lost run look identical from the page
# alone, so the absence is resolved against the forge rather than guessed:
#
# board=pending        a workflow run is queued or in progress for this seat's
#                      newest branch, so the board has nothing yet and should
#                      not. Not a finding.
# board=silent-in-window  nothing is running, and the forge shows a finished run
#                      inside the window the board page covers, which the board
#                      does not have. A finding in its own right — the board is
#                      the instrument every other instrument is built on.
# board=out-of-window  the forge evidence predates the page, so the board's
#                      silence about this seat proves nothing either way.
#
# AGREE      the seat's newest evidence of running is its declared workflow, so
#            an edit to that file reaches the next run.
# ELSEWHERE  the seat ran more recently somewhere else, and the declared workflow
#            has not run since. An edit to that file reaches nothing. gap= is how
#            far apart the two readings are.
# QUIET      no reading has the seat running anywhere, ever. Not a pass: nothing
#            executed this seat, so nothing proved where it would.
# unreadable a field could not be read. The seat is reported, never silently
#            dropped, and the exit status is 2 (L-A44: the cause rides with the
#            value; L-A80: a read that succeeds with nothing in it is not a
#            reading).
#
# Exit status:
#   0  every seat in scope ran last on its declared surface (all AGREE)
#   1  at least one seat runs somewhere its declaration does not name, so an
#      edit to the declared file would reach nothing — named on stdout
#   2  no seat is ELSEWHERE, and at least one could not be read or is QUIET.
#      Never read a 2 as a 0: "I could not look" and "nothing is wrong" are
#      different answers and only one is safe to act on. A found defect is
#      never downgraded to a 2 either, so 1 outranks 2: the actionable answer
#      is the one the exit status carries.
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
    -h|--help) sed -n '2,76p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
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

# Names only. Neither value is ever printed, and the absence of one is reported
# as an inability to look rather than as a clean run (L-X5, L-A80).
[ -n "${BOARD_API_URL:-}" ] || { echo "check-seat-surface: BOARD_API_URL is not set, so the actual surface cannot be read" >&2; exit 2; }
[ -n "${BOARD_RUNTIME_TOKEN:-}" ] || { echo "check-seat-surface: BOARD_RUNTIME_TOKEN is not set, so the actual surface cannot be read" >&2; exit 2; }

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

# The newest board run for a seat, as
# started_at|run_url|trigger|count|page_total|page_oldest. The page's oldest row
# is the only honest statement of what window the board actually answered for,
# because the route carries no limit or saturated field of its own. The
# separator is not a tab on purpose: tab is IFS whitespace, so `read` collapses
# leading empty fields and a seat with no board run read its run count as its
# own timestamp. Measured in this tool before it shipped. And
# the count, because "the board has no record of this seat" is itself a finding
# and must not read the same as "the board has records and they agree".
board_last() { # seat
  echo "$board" | node -e '
    let s=""; process.stdin.on("data",d=>s+=d).on("end",()=>{
      const seat = process.argv[1];
      const runs = (JSON.parse(s).runs || [])
        .filter(r => r.seat === seat)
        .sort((a,b) => String(b.started_at).localeCompare(String(a.started_at)));
      const all = (JSON.parse(s).runs || [])
        .map(r => String(r.started_at || ""))
        .sort();
      const r = runs[0] || {};
      process.stdout.write([
        r.started_at || "", r.run_url || "", r.trigger || "", runs.length,
        all.length, all[0] || "",
      ].join("|"));
    });' "$1"
}

# The weakest reading, and the only one left when the board recorded nothing: the
# newest pull request opened from a branch carrying this seat's name. One call
# serves every seat.
if prs=$(gh pr list --state all --limit 100 --json headRefName,createdAt,number 2>/dev/null); then
  prs_read=yes
else
  prs_read=no; prs='[]'
fi

forge_last() { # seat -> createdAt|number|headRefName
  echo "$prs" | node -e '
    let s=""; process.stdin.on("data",d=>s+=d).on("end",()=>{
      const seat = process.argv[1];
      const hit = JSON.parse(s)
        .filter(p => {
          const b = p.headRefName || "";
          return b.startsWith(seat + "/") || b.includes("-" + seat + "/");
        })
        .sort((a,b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0];
      if (hit) process.stdout.write([hit.createdAt, hit.number, hit.headRefName].join("|"));
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

epoch_of() { # iso timestamp -> seconds, or empty
  [ -n "$1" ] || return 0
  date -u -d "${1%%+*}" +%s 2>/dev/null || true
}

days_between() { # iso iso
  local a b
  a=$(epoch_of "$1"); b=$(epoch_of "$2")
  { [ -n "$a" ] && [ -n "$b" ]; } || { echo unreadable; return; }
  echo "$(( (b > a ? b - a : a - b) / 86400 ))d"
}

elsewhere=0
unclear=0
checked=0

for s in "${seats[@]}"; do
  checked=$((checked + 1))
  wf=$(declared_workflow "$s")
  if [ -z "$wf" ]; then
    printf 'unreadable seat=%s declared=none (company.yaml declares this seat with no workflow)\n' "$s"
    unclear=$((unclear + 1))
    continue
  fi

  # `gh run list --workflow=` takes the file's basename. A workflow that has
  # never run answers with an empty list, which is a reading; a failed call is
  # not, and the two must not print the same thing.
  if dl=$(gh run list --workflow="$(basename "$wf")" --limit 1 \
            --json createdAt,url,event \
            --jq '.[0] | [(.createdAt // ""), (.url // ""), (.event // "")] | join("|")' 2>/dev/null); then
    IFS='|' read -r d_at d_url d_event <<<"${dl:-}"
    d_read=yes
  else
    d_at=; d_url=; d_event=; d_read=no
  fi

  if bl=$(board_last "$s"); then
    IFS='|' read -r b_at b_url b_trigger b_count b_page b_oldest <<<"${bl:-}"
    b_read=yes
  else
    b_at=; b_url=; b_trigger=; b_count=; b_page=; b_oldest=; b_read=no
  fi

  if [ "$d_read" = no ] || [ "$b_read" = no ]; then
    printf 'unreadable seat=%s declared=%s declared_last=%s actual_last=%s (declared read=%s, board read=%s)\n' \
      "$s" "$wf" "$([ "$d_read" = yes ] && day_of "${d_at:-}" || echo unreadable)" \
      "$([ "$b_read" = yes ] && day_of "${b_at:-}" || echo unreadable)" "$d_read" "$b_read"
    unclear=$((unclear + 1))
    continue
  fi

  b_host=$(host_of "${b_url:-}")
  b_count=${b_count:-0}

  # The board records a GitHub Actions run under github.com, so when the board
  # has a run for this seat it is the reading that decides: its host is where
  # the seat actually ran.
  if [ -n "${b_at:-}" ]; then
    if [ "$b_host" = "github.com" ]; then
      printf 'AGREE     seat=%s declared=%s declared_last=%s actual_last=%s event=%s source=board board_runs=%s\n' \
        "$s" "$wf" "$(day_of "${d_at:-}")" "$(day_of "$b_at")" "${d_event:-none}" "$b_count"
    else
      gap=unreadable
      [ -n "${d_at:-}" ] && gap=$(days_between "$d_at" "$b_at")
      printf 'ELSEWHERE seat=%s declared=%s declared_last=%s actual_last=%s gap=%s actual_surface=%s trigger=%s source=board board_runs=%s\n' \
        "$s" "$wf" "$(day_of "${d_at:-}")" "$(day_of "$b_at")" "$gap" "$b_host" "${b_trigger:-none}" "$b_count"
      elsewhere=$((elsewhere + 1))
    fi
    continue
  fi

  # No board run for this seat. That is not agreement, it is the absence of the
  # instrument the org reads, so the verdict falls to the forge and says so.
  IFS='|' read -r f_at f_num f_branch <<<"$(forge_last "$s")"
  f_e=$(epoch_of "${f_at:-}"); d_e=$(epoch_of "${d_at:-}")

  if [ "$prs_read" = no ]; then
    printf 'unreadable seat=%s declared=%s declared_last=%s board_runs=0 board_window_from=%s (board holds no run for this seat in its page and the pull request list could not be read)\n' \
      "$s" "$wf" "$(day_of "${d_at:-}")" "$(day_of "${b_oldest:-}")"
    unclear=$((unclear + 1))
    continue
  fi

  # The board's silence about a seat is only evidence inside the window its page
  # covers. Inside it, the board had the chance and missed the run; before it,
  # the silence says nothing. Two different answers, so they print differently.
  o_e=$(epoch_of "${b_oldest:-}")
  board_note=board=out-of-window
  if [ -n "$f_e" ] && [ -n "$o_e" ] && [ "$f_e" -ge "$o_e" ]; then
    board_note=board=silent-in-window
  fi
  # A run that has not ended cannot be on the board yet, and that is the common
  # case rather than the rare one: this check is itself usually run from inside
  # one. Ask the forge whether anything is still executing on that branch.
  if [ -n "${f_branch:-}" ]; then
    if live=$(gh run list --branch "$f_branch" --limit 20 --json status \
         --jq '[.[] | select(.status == "in_progress" or .status == "queued")] | length' 2>/dev/null); then
      [ "${live:-0}" -gt 0 ] && board_note=board=pending
    else
      board_note=board=unreadable
    fi
  fi

  if [ -n "$f_e" ] && { [ -z "$d_e" ] || [ "$f_e" -gt "$d_e" ]; }; then
    printf 'ELSEWHERE seat=%s declared=%s declared_last=%s actual_last=%s gap=%s actual_surface=unrecorded trigger=unrecorded source=forge(pr#%s) board_runs=0 board_page=%s board_window_from=%s %s\n' \
      "$s" "$wf" "$(day_of "${d_at:-}")" "$(day_of "$f_at")" "$(days_between "${d_at:-}" "$f_at")" "$f_num" \
      "${b_page:-0}" "$(day_of "${b_oldest:-}")" "$board_note"
    elsewhere=$((elsewhere + 1))
    continue
  fi

  if [ -n "${d_at:-}" ]; then
    printf 'AGREE     seat=%s declared=%s declared_last=%s actual_last=%s event=%s source=actions board_runs=0 board_window_from=%s %s\n' \
      "$s" "$wf" "$(day_of "$d_at")" "$(day_of "$d_at")" "${d_event:-none}" "$(day_of "${b_oldest:-}")" "$board_note"
    continue
  fi

  printf 'QUIET     seat=%s declared=%s declared_last=none actual_last=none board_runs=0 board_window_from=%s\n' \
    "$s" "$wf" "$(day_of "${b_oldest:-}")"
  unclear=$((unclear + 1))
done

# 1 outranks 2 on purpose: a seat found running off its declaration is the
# actionable answer, and downgrading it to "could not run" because a different
# seat was quiet would hide the finding behind the weaker one. Both counts are
# always printed, so a 1 never conceals that something was also unreadable.
if [ "$elsewhere" -gt 0 ]; then
  echo "check-seat-surface: $elsewhere of $checked seat(s) run somewhere company.yaml does not name — an edit to the declared workflow reaches nothing (L-A16). $unclear unclear."
  exit 1
fi
if [ "$unclear" -gt 0 ]; then
  echo "check-seat-surface: $unclear of $checked seat(s) could not be read or have never run anywhere. That is not a pass."
  exit 2
fi
echo "check-seat-surface: $checked seat(s) in scope, each last run by the surface it declares."
exit 0
