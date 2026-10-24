#!/usr/bin/env bash
#
# check-draft-prs.sh — which of this product's seat pull requests can nobody merge?
#
# A seat runs with no memory of its own last run, and GitHub refuses to merge a
# draft at all, so a draft with no live run behind it is work that has shipped
# nothing (standards/lessons.md L-A32). This answers that from the branch rather
# than from the description, because a description is what the last run intended
# and the branch is what it left.
#
# Usage:
#   tools/check-draft-prs.sh                 every seat named in company.yaml
#   tools/check-draft-prs.sh --seat engineer one seat
#   tools/check-draft-prs.sh --all           every open draft, seat or not
#   tools/check-draft-prs.sh --fresh-under 0 judge every draft, however new
#
# One line per draft, fields stable enough to grep:
#   STRANDED  #28 atelier-pm/2026-10-21-message idle=71h commits=2 files=3 carries=work run=none
#   LIVE      #47 atelier-engineer/2026-10-24-message idle=2m commits=1 files=1 carries=work run=self
#   FRESH     #52 atelier-engineer/2026-10-24-message-2 idle=4m commits=1 files=0 carries=nothing run=fresh
#   STRANDED  #40 atelier-exo/2026-10-24-message idle=4h commits=3 files=2 carries=work run=ci
#
# carries=work   the branch changes files, so it is unfinished work: ready it
#                (gh pr ready <n>), or write in it which clause keeps it a draft
#   carries=nothing  the branch changes no file: it is not unfinished work, it
#                  is nothing. Close it and re-declare what it owed on the
#                  board.
#   run=self       this is the branch the calling run is standing in, so the seat
#                  holding it is the one reading this line. Not stranded, not
#                  counted. The only reading that works on the surface the seats
#                  actually run on, where there is no Actions run to find.
#   run=live       a run of one of the seat workflows company.yaml declares is
#                  queued or in progress on this branch, so a seat is still
#                  standing in it. Not stranded, not counted.
#   run=ci         some other workflow is queued or in progress on this branch.
#                  A run on the branch is not a seat on the branch: here it is
#                  always tests.yml, which fires on pull_request, so every push
#                  into an open draft starts a job on the seat's branch for
#                  about twenty seconds. It decides nothing: a push in the last
#                  twenty seconds says nothing about whether anyone is working,
#                  and this reading flickers while idle does not. The verdict
#                  is the one age gives, so a draft old enough to judge prints
#                  STRANDED run=ci and a younger one prints FRESH run=fresh,
#                  age winning the field so the whole line holds still. A
#                  declared seat workflow in the same list outranks this.
#   run=fresh      nothing vouches for this branch, and nothing had time to:
#                  its newest commit is younger than --fresh-under minutes, so
#                  the seat that opened it may still be standing in it right
#                  now. Not counted, and counted out loud on the summary line,
#                  because a draft left unjudged must not read as one examined
#                  and cleared (L-A21). This is the reading that covers another
#                  seat's pass running in the same minute as yours, which
#                  run=self cannot see and run=live cannot see here, since no
#                  seat in this product has run on a seat workflow since
#                  September.
#   idle=Nm, idle=Nh
#                  how long since the branch's newest commit — minutes under an
#                  hour, whole hours above it. Minutes because the fresh verdict
#                  turns on this field, and `idle=0h` cannot tell a reader
#                  whether it covered four minutes or fifty-nine.
#   carries=unreadable, run=unreadable, idle=unreadable
#                  the field could not be read. The draft still counts as
#                  stranded, because the cheap error here is one merge of
#                  waiting and the expensive one is closing work that exists.
#
# Exit status:
#   0  no stranded drafts in scope — every seat PR is reachable by a merger,
#      or too new to be judged, which the summary line names separately
#   1  at least one stranded draft — named on stdout, one per line
#   2  the check could not run (no gh, no auth, not a repo, a seat name no
#      company.yaml declares, a --fresh-under that is not a whole number of
#      minutes). Never read a 2 as a 0.
#
# Read the status, never a pipe's: `npm run drafts | tail` reports the tail's 0
# whatever the check found. Pipe and you want ${PIPESTATUS[0]}.
#
# Requires: git, gh (authenticated). No npm dependencies, by this product's ethos.

set -euo pipefail

# How new a draft has to be for this check to decline to judge it, in minutes.
#
# A draft is stranded when time has passed and no merger could reach it, so the
# quantity being measured is time. `run=self` and `run=live` answer "is a seat
# standing in this branch" and neither can see another seat's pass running in
# the same minute as yours — the Actions API cannot see a host window at all,
# and the board only learns of a run when it ends. So the only reading left for
# that case is the age of the branch's newest commit, and this is the number it
# is compared against. It is also the reading that replaced the Actions one for
# every draft but a genuine forge seat run, because an age is a fact about the
# branch and the presence of a test job is a fact about the last twenty
# seconds.
#
# 60, measured rather than picked. `GET /api/board/atelier` on 2026-10-24 at
# 22:09Z served 25 runs spanning 01:54Z to 22:07Z, and the longest seat run on
# this product's whole record is 23m — the exo seat's own, 88 turns, 21:40:18Z
# to 22:03:40Z. 60 is 2.6x that, and the headroom is the point rather than
# slack: that page is capped at 25 rows and carries no field saying it
# truncated, so every maximum read from it can only rise. It also bounds the
# wrong quantity on purpose. A run's idle time is not its length, it is the gap
# from its last commit to its end, and the practice every charter here mandates
# — open the draft first, commit as you go — makes that gap as long as the run.
#
# In minutes, not in hours, so that the number is a number a reader can find
# and change rather than an integer division to be reverse-engineered, and so
# that it can be retuned from evidence without touching the arithmetic.
# --fresh-under 0 turns the guard off and judges every draft, which is the
# reading a merger sweeping the queue wants.
fresh_under_min=60

scope=seats
seat=
while [ $# -gt 0 ]; do
  case "$1" in
    --all)   scope=all; shift ;;
    --seat)  scope=one; seat="${2:-}"; shift 2 ;;
    # A threshold that silently became 0 would turn the guard off and read as a
    # clean sweep, so a value that is not a whole number of minutes is an
    # unasked question (exit 2) rather than a default quietly restored.
    --fresh-under)
      fresh_under_min="${2:-}"
      case "$fresh_under_min" in
        ''|*[!0-9]*) echo "check-draft-prs: --fresh-under needs a whole number of minutes, got: ${2:-<nothing>}" >&2; exit 2 ;;
      esac
      shift 2 ;;
    # The whole leading comment block, however long it grows: a line range
    # here silently truncates the help the next time this header is edited.
    -h|--help) awk 'NR>1 && /^#/ { sub(/^# ?/, ""); print; next } NR>1 { exit }' "$0"; exit 0 ;;
    *) echo "check-draft-prs: unknown argument: $1" >&2; exit 2 ;;
  esac
done
[ "$scope" = one ] && [ -z "$seat" ] && { echo "check-draft-prs: --seat needs a name" >&2; exit 2; }

command -v gh >/dev/null 2>&1 || { echo "check-draft-prs: gh is not installed" >&2; exit 2; }
git rev-parse --git-dir >/dev/null 2>&1 || { echo "check-draft-prs: not a git repository" >&2; exit 2; }
gh auth status >/dev/null 2>&1 || { echo "check-draft-prs: gh is not authenticated" >&2; exit 2; }

root=$(git rev-parse --show-toplevel)
base=$(gh repo view --json defaultBranchRef --jq .defaultBranchRef.name) || {
  echo "check-draft-prs: could not read the default branch" >&2; exit 2; }

# The branch this run is standing in, read once. A run's own draft is live by
# construction, and on the surface that actually runs the seats there is no
# other way to know it: every seat run here is a host window on the resident
# runtime, which the Actions API below cannot see, so `run=live` fires on no
# run this product is actually having and the caller's own minutes-old draft
# read as stranded. Empty when HEAD is detached, and empty keeps the
# conservative default: a draft nothing vouches for still counts as stranded.
self=$(git rev-parse --abbrev-ref HEAD 2>/dev/null) || self=
[ "$self" = HEAD ] && self=

# The seat names come from company.yaml, so a new seat is in scope the day it is
# declared rather than the day somebody remembers this file.
declared=()
if [ -f "$root/company.yaml" ]; then
  while IFS= read -r line; do declared+=("$line"); done < <(
    sed -n 's/^  - *{ *name: *\([a-z0-9-]*\).*/\1/p' "$root/company.yaml")
fi

# And the workflow each seat is declared to run on, which is what separates a
# seat executing on the forge from the test job every push to an open draft
# starts. The Actions API reports a run's workflow as the path of its file,
# which is the same string company.yaml carries, so the two are compared
# without a name lookup and a workflow rename cannot drift them apart.
# Empty means nothing can read `run=live`, and the summary line says so rather
# than letting every in-flight run quietly become a `ci`.
declared_workflows=()
if [ -f "$root/company.yaml" ]; then
  while IFS= read -r line; do declared_workflows+=("$line"); done < <(
    sed -n 's/^  - *{ *name: *[a-z0-9-]* *, *workflow: *\([^ ,}]*\).*/\1/p' "$root/company.yaml")
fi

is_seat_workflow() { # path
  local w
  for w in ${declared_workflows[@]+"${declared_workflows[@]}"}; do
    [ "$w" = "$1" ] && return 0
  done
  return 1
}

seats=()
case "$scope" in
  # A misspelled seat matches no branch, and a scope that matched nothing used to
  # exit 0 — a false all-clear one character away, inside a check whose whole
  # argument is that a check which could not run is not a pass. So a --seat name
  # is answered against company.yaml before any draft is read: a name nothing
  # declares is an unasked question, not a clean one.
  one)
    for s in "${declared[@]}"; do [ "$s" = "$seat" ] && seats=("$seat"); done
    if [ ${#seats[@]} -eq 0 ]; then
      if [ ${#declared[@]} -eq 0 ]; then
        echo "check-draft-prs: company.yaml named no seats, so --seat $seat could not be answered; use --all" >&2
      else
        echo "check-draft-prs: no seat named $seat in company.yaml (declared: ${declared[*]}); use --all for an undeclared branch" >&2
      fi
      exit 2
    fi ;;
  seats)
    seats=("${declared[@]}")
    [ ${#seats[@]} -eq 0 ] && { echo "check-draft-prs: company.yaml named no seats; use --all" >&2; exit 2; } ;;
esac

in_scope() { # branch
  [ "$scope" = all ] && return 0
  local b="$1" s
  for s in "${seats[@]}"; do
    case "$b" in "$s"/*|*-"$s"/*) return 0 ;; esac
  done
  return 1
}

now=$(date -u +%s)
stranded=0
fresh=0
checked=0
skipped=0

while IFS=$'\t' read -r number branch; do
  [ -z "$number" ] && continue
  if ! in_scope "$branch"; then skipped=$((skipped + 1)); continue; fi
  checked=$((checked + 1))

  # Compare against the default branch: the branch's own account of itself.
  # A read that failed is never reported as a zero — the cause rides with the
  # value (L-A44), because "changes no file" is the one answer that tells a
  # reader to close the pull request.
  if compare=$(gh api "repos/{owner}/{repo}/compare/$base...$branch" \
       --jq '[(.ahead_by // 0), (.files | length)] | @tsv' 2>/dev/null); then
    IFS=$'\t' read -r commits files <<<"$compare"
    [ "$files" -gt 0 ] && carries=work || carries=nothing
  else
    commits=? files=? carries=unreadable
  fi

  if last=$(gh api "repos/{owner}/{repo}/commits?sha=$branch&per_page=1" \
       --jq '.[0].commit.committer.date' 2>/dev/null) && [ -n "$last" ] \
     && last_epoch=$(date -u -d "$last" +%s 2>/dev/null); then
    idle_s=$(( now - last_epoch ))
    if [ "$idle_s" -lt 3600 ]; then idle="$(( idle_s / 60 ))m"; else idle="$(( idle_s / 3600 ))h"; fi
  else
    idle=unreadable
    idle_s=
  fi

  # Which workflows are in flight on this branch, by path, newest first. The
  # count this used to take is not enough: it answered "a run" where the
  # question is "a seat", and in this repository the runs on a seat branch are
  # all tests.yml, so the count made the verdict turn on whether a test job
  # happened to be alive in the second the line printed.
  if [ -n "$self" ] && [ "$branch" = "$self" ]; then
    run=self
  elif inflight=$(gh api "repos/{owner}/{repo}/actions/runs?branch=$branch&per_page=20" \
       --jq '[.workflow_runs[] | select(.status == "in_progress" or .status == "queued") | .path] | join("\n")' 2>/dev/null); then
    run=none
    while IFS= read -r wf; do
      [ -n "$wf" ] || continue
      if is_seat_workflow "$wf"; then run=live; break; fi
      run=ci
    done <<<"$inflight"
  else
    run=unreadable
  fi

  # Nothing vouched for this branch. Before calling that stranded, ask whether
  # anything could have: a draft minutes old has had no time to be abandoned,
  # and the seat that opened it may be standing in it as this line prints.
  # An unreadable idle field can never reach this test, so a failed read still
  # counts as stranded — the cause rides with the value (L-A44), and the cheap
  # error here is one merge of waiting.
  # `ci` reaches this test as well as `none`: a test job in flight is not a
  # reason to excuse a draft, and it is not a reason to refuse it the excuse
  # age would have given it either. The two readings print differently and are
  # judged the same, and that is the whole of the fix.
  if { [ "$run" = none ] || [ "$run" = ci ]; } && [ "$fresh_under_min" -gt 0 ] \
     && [ -n "$idle_s" ] && [ "$idle_s" -lt $(( fresh_under_min * 60 )) ]; then
    run=fresh
  fi

  if [ "$run" = live ] || [ "$run" = self ]; then
    printf 'LIVE      #%s %s idle=%s commits=%s files=%s carries=%s run=%s\n' \
      "$number" "$branch" "$idle" "$commits" "$files" "$carries" "$run"
  elif [ "$run" = fresh ]; then
    fresh=$((fresh + 1))
    printf 'FRESH     #%s %s idle=%s commits=%s files=%s carries=%s run=%s\n' \
      "$number" "$branch" "$idle" "$commits" "$files" "$carries" "$run"
  else
    stranded=$((stranded + 1))
    printf 'STRANDED  #%s %s idle=%s commits=%s files=%s carries=%s run=%s\n' \
      "$number" "$branch" "$idle" "$commits" "$files" "$carries" "$run"
  fi
done < <(gh pr list --state open --limit 100 --json number,headRefName,isDraft \
           --jq '.[] | select(.isDraft) | [.number, .headRefName] | @tsv')

# What was read, always, so that "examined everything and found nothing" and
# "examined nothing" are different sentences rather than the same clean line
# (L-A21). The out-of-scope count is the one that tells a reader their scope
# missed the queue.
read_note="$skipped out of scope"
[ "$fresh" -gt 0 ] && read_note="$read_note, $fresh too fresh to judge (under ${fresh_under_min}m)"
[ -n "$self" ] || read_note="$read_note, no own branch (detached HEAD)"
[ ${#declared_workflows[@]} -gt 0 ] || read_note="$read_note, no seat workflow declared (run=live unreachable)"

if [ "$stranded" -gt 0 ]; then
  echo "check-draft-prs: $stranded of $checked draft(s) in scope are stranded ($read_note) — ready them, close them, or name the clause that keeps them drafts (L-A32)."
  exit 1
fi
echo "check-draft-prs: $checked draft(s) in scope, $read_note, none stranded."
exit 0
