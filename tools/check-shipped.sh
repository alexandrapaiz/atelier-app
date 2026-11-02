#!/usr/bin/env bash
#
# check-shipped.sh — did the seat run that just ended leave its work anywhere
# but the sandbox?
#
# A seat run that worked for forty turns, reported success, and pushed nothing
# loses everything at teardown (docs/agents/incidents.md I3). The guard against
# that has lived since September as a step inside
# .github/workflows/agent-{engineer,exo,pm}.yml, and those three files last
# executed a seat on 2026-09-24 (L4). Every seat run since has been a host
# window on the resident runtime, which checks the repository out, reads
# prompts/, and never reads .github/. So the guard binds the surface that does
# not run the seats, and the surface that does run them has none — which is the
# whole of incident I13 and the reason this file exists rather than another
# workflow edit. A tool in here can be called from both.
#
# The body is the tripwire step as PR #11 leaves it at commit e53e810, with the
# divergences listed under "What this port changed" below. Each one is a rule
# this repository already carries, not a preference.
#
# Usage:
#   tools/check-shipped.sh                      judge the run standing here
#   tools/check-shipped.sh --base main          name the base branch
#   tools/check-shipped.sh --base-sha <sha>     the base tip read BEFORE the run
#   tools/check-shipped.sh --fixture DIR        read every input from files
#
# --base-sha takes a commit sha, full or abbreviated — `git rev-parse HEAD` and
# `git rev-parse --short HEAD` are both read as the same tip, because an
# abbreviation is a spelling and not a movement. Anything that is not 4 to 40
# hex characters is a caller error and exits 2 rather than being compared as a
# string: that comparison's unequal branch is the one that *passes*, so a bad
# argument there would mask every failing verdict below (I16).
#
# One line per reading, then one verdict line. Fields stable enough to grep:
#   SHIPPED    branch=atelier-engineer/2026-10-24-message-2 source=remote-head
#
# Verdicts:
#   SHIPPED    the remote holds this run's work: the branch is there at this
#              exact HEAD (source=remote-head), or the base advanced past the
#              tip captured before the run (source=base-advanced).
#   ORPHANED   the remote holds the branch at an older tip, so the commits above
#              it die with the sandbox. Both shas are named. Push again.
#   UNPUSHED   the work is only in the sandbox: there are commits ahead of the
#              base and the remote does not have this branch at all, or the
#              run's only product is an uncommitted diff.
#   NOTHING    no commit, no branch, no pull request, nothing uncommitted. A
#              green model step is not evidence of work.
#   INCONCLUSIVE  a reading this verdict needs came back unreadable. Never a
#              pass, never reported as one of the four above.
#
# Exit status:
#   0  SHIPPED
#   1  ORPHANED, UNPUSHED or NOTHING — this run's work is not safe
#   2  INCONCLUSIVE, or the check could not start. Never read a 2 as a 0.
#
# What this port changed, and why each one is not taste:
#
#   1. $GITHUB_STEP_SUMMARY is optional. The readings always go to stdout and
#      the summary file is written only when the variable names one, because no
#      API serves a job summary and a verdict nobody can re-read is a verdict
#      nobody can correct (L-E11). This is the change the ask asked for.
#   2. The base branch is a flag or the forge's own answer, never
#      $GITHUB_REF_NAME, which exists on one of the two surfaces.
#   3. "The remote could not be asked" exits 2 rather than 1. It still fails a
#      caller that tests for zero, which is what the step wanted, and it stops
#      reporting a failed reading as a finding about the run (L6).
#   4. A commit count that could not be taken is unreadable, not zero. The step
#      read `git rev-list --count ... || echo 0`, and a zero is an input to
#      NOTHING, so a failed count could print the loudest verdict in the file.
#   5. Nothing here fetches. The step's `git fetch origin` writes to the refs of
#      whatever checkout it is standing in, and a measurement that runs in
#      somebody else's tree may only ask questions (L-E12). The reading that
#      matters needs no local ref: `git ls-remote` asks the remote by name.
#   6. --base-sha, and the verdict NOTHING will not fire without it. After a
#      Tier A self-merge HEAD never leaves the base, the seat branch is deleted,
#      and `gh pr list --head <base>` finds nothing, so all three of the step's
#      shipped-ness signals read empty on the cleanest ship path the company has
#      — six false failures at HQ by the project manager's own count (L-E11).
#      A run's success is measured against state captured before it ran, so the
#      caller passes the base tip it read before dispatching, and without it
#      this check says which signals it read instead of asserting the worst.
#   7. A run whose only product is uncommitted changes fails. The step printed
#      the warning that those changes are lost at teardown and then exited zero
#      one screen below it, and that loss is what incident I3 is about.
#
# The last line this prints names the status it is about to return, as
# `(exit N)`, the argument refusals included. The exit status is still the
# contract; the suffix is there because a pipe destroys the status and not the
# text, and a verdict line pasted into a register loses its status on the way.
# If you need the status itself out of a pipeline, it is ${PIPESTATUS[0]}.
#
# Requires: git. gh only for the pull request field, which degrades to
# unreadable without it. No npm dependencies, by this product's ethos.

set -euo pipefail

# One call prints the status and returns it, so the number in the text and the
# number in `$?` cannot drift apart. A summary that merely mentions a status
# somebody typed is a second decision that can drift from the first.
verdict() { # status, line...
  local status=$1; shift
  printf '%s (exit %s)\n' "$*" "$status"
  exit "$status"
}
refuse() { # status, line...  — the argument paths, on stderr
  local status=$1; shift
  printf '%s (exit %s)\n' "$*" "$status" >&2
  exit "$status"
}


# A flag typed without its value is a question nobody asked, and until
# 2026-10-25 none of the three tools in here said so. Two shapes, both wrong in
# the direction that matters. `--seat` and `--base` died inside `shift 2`,
# which fails on one remaining argument, and `set -e` turns a failed shift into
# exit 1 — the status that means a finding. `--company` and `--fixture` read as
# the empty string, and empty is this code's "not given", so the tool silently
# answered the live question instead of the one on the command line. Both are
# L6: the third outcome is could-not-run, and a caller error is never either of
# the other two.
need_value() { # flag, $# at the point of the match
  [ "$2" -ge 2 ] || refuse 2 "check-shipped: $1 needs a value"
}
base=
base_sha=
fixture=
while [ $# -gt 0 ]; do
  case "$1" in
    # `shift 2` with one argument left fails, and `set -e` turns a failed shift
    # into exit 1 — the status that means this run's work is not safe. So
    # `--base` with nothing after it reported a loss that had not happened,
    # which is this file's own subject matter. Shift what is there (L6).
    --base)     need_value --base $#; base="$2"; shift 2 ;;
    # A --base-sha that is not a commit sha is a caller error and not a base
    # tip. `--base-sha main`, or a typo, would otherwise be compared against
    # the sha the tool reads and read as the base having moved — which is the
    # *passing* branch below, so the loudest failures in this file would be
    # masked by a bad argument (I16). The bounds are git's own: 4 is the
    # shortest abbreviation git will resolve (core.abbrev), 40 a full sha, and
    # the lower bound matters because anything shorter could collide with a
    # real tip by chance and so must never reach the comparison at all.
    --base-sha)
      need_value --base-sha $#
      base_sha="$2"
      base_sha_ok=yes
      case "$base_sha" in ''|*[!0-9a-fA-F]*) base_sha_ok=no ;; esac
      if [ "${#base_sha}" -lt 4 ] || [ "${#base_sha}" -gt 40 ]; then
        base_sha_ok=no
      fi
      if [ "$base_sha_ok" = no ]; then
        refuse 2 "check-shipped: --base-sha needs a commit sha of 4 to 40 hex characters, got: ${2:-<nothing>}"
      fi
      shift 2 ;;
    --fixture)  need_value --fixture $#; fixture="$2"; shift 2 ;;
    # The whole header block, found by where the comments stop rather than by a
    # line number: this run grew the header by six lines, and a hardcoded range
    # would have silently cut --help off mid-sentence.
    -h|--help)  awk 'NR>1 && !/^#/{exit} NR>1{sub(/^# ?/,""); print}' "$0"; exit 0 ;;
    *) refuse 2 "check-shipped: unknown argument: $1" ;;
  esac
done

if [ -n "$fixture" ]; then
  [ -d "$fixture" ] || refuse 2 "check-shipped: --fixture $fixture is not a directory"
else
  git rev-parse --git-dir >/dev/null 2>&1 || refuse 2 "check-shipped: not a git repository"
fi

# Every reading is taken through one of these, so the fixture serves the same
# shape the live command does and the decision table below never knows which it
# got. A file absent from DIR is the reading coming back EMPTY; a file whose
# first line is `FAIL` is the reading failing. Those are different answers and
# this tool is mostly about not confusing them.
read_fixture() { # file
  [ -f "$fixture/$1" ] || return 1
  cat "$fixture/$1"
}

# --- the readings ------------------------------------------------------------

if [ -n "$fixture" ]; then
  branch=$(read_fixture branch || echo HEAD)
else
  branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo HEAD)
fi

if [ -z "$base" ]; then
  if [ -n "$fixture" ]; then
    base=$(read_fixture base || echo main)
  elif command -v gh >/dev/null 2>&1 \
       && b=$(gh repo view --json defaultBranchRef --jq .defaultBranchRef.name 2>/dev/null) \
       && [ -n "$b" ]; then
    base="$b"
  else
    # Named rather than silent: this is the convention, not a reading.
    base=main
    base_source=convention
  fi
fi
base_source="${base_source:-read}"

if [ -n "$fixture" ]; then
  head_sha=$(read_fixture head || echo unreadable)
  dirty=$(read_fixture dirty || true)
  commits=$(read_fixture commits || echo unreadable)
else
  head_sha=$(git rev-parse HEAD 2>/dev/null || echo unreadable)
  dirty=$(git status --porcelain 2>/dev/null || true)
  # Port change 4: a count that could not be taken is unreadable and not zero,
  # because zero is an input to the loudest verdict here.
  if git rev-parse --verify --quiet "origin/$base" >/dev/null 2>&1; then
    commits=$(git rev-list --count "origin/$base..HEAD" 2>/dev/null || echo unreadable)
  else
    commits=unreadable
  fi
fi

# The reading the whole fix is about. `git branch -r --contains HEAD` answers
# only from the tracking refs the clone's refspec created, and a seat clone may
# fetch the mainline alone (+refs/heads/main:refs/remotes/origin/main), in which
# case it reads EMPTY for a branch the remote is holding at this exact HEAD and
# a run that shipped is failed as a run that shipped nothing. Measured on the
# resident runtime 2026-10-24 (I13): empty from `git branch -r`, answered by
# `git ls-remote`. The cause is the refspec and not the depth, so no fetch
# repairs it; one question put to the remote needs no local ref at all.
#
# The base branch is still excluded by name, which is what the old reading got
# right: a run that never branched leaves HEAD on the base and satisfies any
# "is it on the remote" test trivially — epitome run 35956231272 died at turn
# one, produced nothing, and the tripwire reported success.
pushed=""
stale=""
unasked=""
remote_sha=""
if [ "$branch" != "$base" ] && [ "$branch" != "HEAD" ]; then
  if [ -n "$fixture" ]; then
    if ls_out=$(read_fixture lsremote); then
      case "$ls_out" in FAIL*) ls_ok=no ;; *) ls_ok=yes ;; esac
    else
      ls_out=""; ls_ok=yes   # the remote answered, and it has no such branch
    fi
  else
    if ls_out=$(git ls-remote --heads origin "$branch" 2>&1); then ls_ok=yes; else ls_ok=no; fi
  fi
  if [ "$ls_ok" = yes ]; then
    remote_sha=$(printf '%s\n' "$ls_out" | head -1 | cut -f1)
    if [ -n "$remote_sha" ] && [ "$remote_sha" = "$head_sha" ]; then
      pushed="origin/$branch"
    elif [ -n "$remote_sha" ]; then
      stale="origin/$branch is at $remote_sha but HEAD is $head_sha"
    fi
  else
    # one line, because a GitHub annotation is one line
    unasked="asking the remote for $branch failed: $(printf '%s' "${ls_out#FAIL}" | tr '\n' ' ')"
  fi
fi

# Port change 6: the base tip captured before the run. Compared against the
# remote's base now, this is the only signal the Tier A self-merge path leaves.
advanced=""
base_now=""
if [ -n "$base_sha" ]; then
  if [ -n "$fixture" ]; then
    base_now=$(read_fixture base_now || echo "")
  else
    base_now=$(git ls-remote --heads origin "$base" 2>/dev/null | head -1 | cut -f1 || echo "")
  fi
  # Both sides into one normal form before they are compared. $base_now is a
  # full forty-hex sha the tool read for itself; $base_sha is whatever spelling
  # the caller captured, and `git rev-parse --short HEAD` is the ordinary way
  # to capture a base tip in a shell — it is what nearly every run report in
  # this company prints. Compared as plain strings, the abbreviation of a
  # commit reads as that commit having *moved*, and the inequality branch is
  # the passing one, tested above ORPHANED, UNPUSHED and NOTHING: so one short
  # sha masked every failing verdict this check has (I16).
  #
  # The normal form is lowercase, then equality or prefix. Two spellings of one
  # commit can only differ in case or in length, so that pair decides every
  # case, and the parse check above has already guaranteed both are hex and at
  # least four characters — the shortest abbreviation git itself will resolve.
  # Deliberately no `git rev-parse` here: resolution would decide nothing the
  # prefix test does not, and it fails exactly where this flag is needed, since
  # on a shallow clone the pre-run tip of a base that really did advance is not
  # an object the checkout holds (the self-merge case). Where the two are
  # neither equal nor a prefix, the base moved.
  if [ -n "$base_now" ]; then
    then_sha=$(printf '%s' "$base_sha" | tr 'A-F' 'a-f')
    now_sha=$(printf '%s' "$base_now" | tr 'A-F' 'a-f')
    if [ "$then_sha" = "$now_sha" ]; then
      :
    elif [ "${now_sha#"$then_sha"}" != "$now_sha" ] \
      || [ "${then_sha#"$now_sha"}" != "$then_sha" ]; then
      :   # one is the other's abbreviation, so this is one commit
    else
      advanced="origin/$base moved from $base_sha to $base_now"
    fi
  fi
fi

if [ -n "$fixture" ]; then
  pr=$(read_fixture pr || echo "")
  case "$pr" in FAIL*) pr=unreadable ;; esac
elif command -v gh >/dev/null 2>&1; then
  pr=$(gh pr list --head "$branch" --state all --json number --jq '.[0].number' 2>/dev/null || echo unreadable)
else
  pr=unreadable
fi

# --- the report -------------------------------------------------------------
#
# Always to stdout. The step summary is written too when the runner names one,
# which is the one thing in the original body that assumed a runner.
report() {
  echo "### Did this run ship anything?"
  echo ""
  echo "- branch: \`$branch\` ($commits commit(s) ahead of $base, base named by $base_source)"
  echo "- pushed to a seat branch (asked of the remote): ${pushed:-NO}"
  [ -n "$stale" ]    && echo "- the remote has the branch at another tip: $stale"
  [ -n "$unasked" ]  && echo "- the remote could not be asked: $unasked"
  [ -n "$base_sha" ] && echo "- base before this run: $base_sha; base now: ${base_now:-unreadable}${advanced:+ (advanced)}"
  [ -z "$base_sha" ] && echo "- base before this run: not given, so a merge onto $base is not a reading this run can take"
  echo "- pull request: ${pr:-none}"
  return 0
}
report
[ -n "${GITHUB_STEP_SUMMARY:-}" ] && report >> "$GITHUB_STEP_SUMMARY"

if [ -n "$dirty" ]; then
  echo "::warning::Uncommitted changes were left in the sandbox and are lost at teardown."
  printf '%s\n' "$dirty" | head -20
fi

# --- the verdict ------------------------------------------------------------
#
# Ordered so that evidence of shipping is read before any absence of it, and so
# that an unreadable input can never reach a verdict that needs it.

if [ -n "$pushed" ]; then
  verdict 0 "SHIPPED    branch=$branch source=remote-head sha=$head_sha pr=${pr:-none}"
fi

if [ -n "$advanced" ]; then
  # Weak on purpose, and the line says so: the base moving cannot tell this
  # run's merge from a concurrent one. It is still the only signal a Tier A
  # self-merge leaves, and the alternative is the six false failures at HQ.
  verdict 0 "SHIPPED    branch=$branch source=base-advanced $advanced (weak: a concurrent merge reads the same)"
fi

if [ -n "$unasked" ]; then
  echo "INCONCLUSIVE  branch=$branch source=remote-unreadable $unasked"
  verdict 2 "check-shipped: the remote could not be asked whether it has this run's work. A check that could not run is not a pass, and for a ship check the conservative answer is to fail loudly."
fi

if [ -n "$stale" ]; then
  echo "ORPHANED   branch=$branch source=remote-head $stale"
  verdict 1 "check-shipped: the remote holds $branch but not this run's HEAD, so every commit above the remote tip dies with the sandbox. Push again."
fi

if [ "$commits" = unreadable ]; then
  echo "INCONCLUSIVE  branch=$branch source=commits-unreadable (origin/$base could not be counted against)"
  verdict 2 "check-shipped: this run's commit count could not be read, so neither UNPUSHED nor NOTHING is a verdict this check has earned."
fi

if [ "$commits" != 0 ]; then
  echo "UNPUSHED   branch=$branch source=remote-head commits=$commits"
  verdict 1 "check-shipped: this run made $commits commit(s) that were never pushed, so the work dies with the sandbox. See incident 3 in docs/agents/incidents.md and the 'Ship first, then work' rule in the seat charters."
fi

if [ "$pr" = unreadable ]; then
  echo "INCONCLUSIVE  branch=$branch source=pr-unreadable commits=0"
  verdict 2 "check-shipped: no commits and no readable pull request field, which is not the same finding as a run that produced nothing."
fi

if [ -z "$pr" ]; then
  if [ -n "$dirty" ]; then
    # Port change 7. The step ended green here, one screen below its own
    # warning that these changes are lost at teardown. Work that exists only
    # as an uncommitted diff in a sandbox being torn down is the exact loss
    # incident I3 is about, so it is not a pass.
    echo "UNPUSHED   branch=$branch source=uncommitted-only commits=0 pr=none"
    verdict 1 "check-shipped: this run's only product is uncommitted changes, which are lost at teardown. Commit and push them."
  fi
  if [ -z "$base_sha" ]; then
    # L-E11's measurement clause: report the smallest true thing. Without the
    # pre-run base tip, a clean self-merge and a run that did nothing leave the
    # identical wreckage, and this check will not call one of them the other.
    echo "INCONCLUSIVE  branch=$branch source=no-pre-run-state commits=0 pr=none"
    verdict 2 "check-shipped: nothing was found on any signal this check can read after the fact, and without --base-sha a Tier A self-merge looks exactly like this. Pass the base tip captured before the run to get a verdict."
  fi
  echo "NOTHING    branch=$branch source=base-unmoved commits=0 pr=none dirty=none"
  verdict 1 "check-shipped: this run produced nothing at all: no commit, no seat branch, no pull request, and $base did not move. A green model step is not evidence of work; read the seat run step's own outcome."
fi

# A pull request exists and this run added nothing on top of the base. Weak,
# and named weak: the work is in the forge from some run, not necessarily this
# one. It is the step's own reading of this state and there is no stronger one
# available after the fact.
verdict 0 "SHIPPED    branch=$branch source=pull-request pr=$pr commits=0 (weak: the pull request may predate this run)"
