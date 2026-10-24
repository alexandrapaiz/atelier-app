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
#
# One line per draft, fields stable enough to grep:
#   STRANDED  #28 atelier-pm/2026-10-21-message idle=71h commits=2 files=3 carries=work run=none
#   LIVE      #47 atelier-engineer/2026-10-24-message idle=0h commits=1 files=1 carries=work run=self
#
# carries=work   the branch changes files, so it is unfinished work: ready it
#                (gh pr ready <n>), or write in it which clause keeps it a draft
#   carries=nothing  the branch changes no file: it is not unfinished work, it is
#                nothing. Close it and re-declare what it owed on the board.
#   run=self       this is the branch the calling run is standing in, so the seat
#                  holding it is the one reading this line. Not stranded, not
#                  counted. The only reading that works on the surface the seats
#                  actually run on, where there is no Actions run to find.
#   run=live       a workflow run is queued or in progress for this branch, so a
#                  seat is still standing in it. Not stranded, not counted.
#   carries=unreadable, run=unreadable, idle=unreadable
#                  the field could not be read. The draft still counts as
#                  stranded, because the cheap error here is one merge of
#                  waiting and the expensive one is closing work that exists.
#
# Exit status:
#   0  no stranded drafts in scope — every seat PR is reachable by a merger
#   1  at least one stranded draft — named on stdout, one per line
#   2  the check could not run (no gh, no auth, not a repo, a seat name no
#      company.yaml declares). Never read a 2 as a 0.
#
# Read the status, never a pipe's: `npm run drafts | tail` reports the tail's 0
# whatever the check found. Pipe and you want ${PIPESTATUS[0]}.
#
# Requires: git, gh (authenticated). No npm dependencies, by this product's ethos.

set -euo pipefail

scope=seats
seat=
while [ $# -gt 0 ]; do
  case "$1" in
    --all)   scope=all; shift ;;
    --seat)  scope=one; seat="${2:-}"; shift 2 ;;
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
# runtime, which the Actions API below cannot see, so `run=live` can never
# fire and the caller's own minutes-old draft reads as stranded. Empty when
# HEAD is detached, and empty keeps the conservative default: a draft nothing
# vouches for still counts as stranded.
self=$(git rev-parse --abbrev-ref HEAD 2>/dev/null) || self=
[ "$self" = HEAD ] && self=

# The seat names come from company.yaml, so a new seat is in scope the day it is
# declared rather than the day somebody remembers this file.
declared=()
if [ -f "$root/company.yaml" ]; then
  while IFS= read -r line; do declared+=("$line"); done < <(
    sed -n 's/^  - *{ *name: *\([a-z0-9-]*\).*/\1/p' "$root/company.yaml")
fi

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
    idle=$(( (now - last_epoch) / 3600 ))h
  else
    idle=unreadable
  fi

  if [ -n "$self" ] && [ "$branch" = "$self" ]; then
    run=self
  elif live=$(gh run list --branch "$branch" --limit 20 --json status \
       --jq '[.[] | select(.status == "in_progress" or .status == "queued")] | length' 2>/dev/null); then
    [ "$live" -gt 0 ] && run=live || run=none
  else
    run=unreadable
  fi

  if [ "$run" = live ] || [ "$run" = self ]; then
    printf 'LIVE      #%s %s idle=%s commits=%s files=%s carries=%s run=%s\n' \
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
[ -n "$self" ] || read_note="$read_note, no own branch (detached HEAD)"

if [ "$stranded" -gt 0 ]; then
  echo "check-draft-prs: $stranded of $checked draft(s) in scope are stranded ($read_note) — ready them, close them, or name the clause that keeps them drafts (L-A32)."
  exit 1
fi
echo "check-draft-prs: $checked draft(s) in scope, $read_note, none stranded."
exit 0
