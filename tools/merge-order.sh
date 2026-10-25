#!/usr/bin/env bash
#
# merge-order.sh — which of this product's open pull requests cannot be merged,
# and which file blocks the most of them?
#
# Company law already names this instrument by path. standards/lessons.md L-A48
# says a shared append-only register is a mutual-exclusion anchor, that every
# concurrent pass is "individually MERGEABLE against main, which is the only
# question any per-pull-request check asks, and mutually exclusive with every
# sibling, which is the question nobody asks until the merge", and that the way
# to measure it is "`tools/merge-order.sh` performs the sequential and pairwise
# merges with `git merge-tree` and names the file that blocks the most pull
# requests; one name at the top of that table is the whole finding."
#
# That tool did not exist here. This repository has measured the property by
# hand three times instead — docs/ideas.md's entry of 2026-10-24 (six pull
# requests, fifteen pairs, #28 x #30 exclusive over SPRINTS.md and
# docs/agents/pending.md) and docs/agents/pending.md entry 5, twice, once
# because the branch had moved under the first reading. Each hand measurement
# was correct and each one perished the moment the queue changed, which is
# L-A64: a measurement of another seat's branch has to be taken again, so the
# thing worth shipping is the taking rather than the number.
#
# Usage:
#   tools/merge-order.sh                     the live open queue, oldest first
#   tools/merge-order.sh --base main         name the base branch
#   tools/merge-order.sh --prs FILE          serve the queue from a TSV instead
#                                            of the forge
#   tools/merge-order.sh --fetch             fetch the branch refs this needs
#   tools/merge-order.sh --limit N           read at most N open pull requests
#
# One line per reading, then one verdict line. Fields stable enough to grep:
#   SEQ      #60 atelier-engineer/2026-10-24-message-5 merges order=1
#   EXCLUSIVE #64 x #66 files=docs/ideas.md
#   ANCHOR   docs/ideas.md pairs=1 prs=2
#   BLOCKED  sequence=2/3 exclusive-pairs=1/3 anchor=docs/ideas.md
#
# Verdicts:
#   CLEAN     every open pull request in scope merges in sequence, and no pair
#             is mutually exclusive. The queue can be landed in any order.
#   BLOCKED   at least one pull request cannot be merged after its predecessors,
#             or at least one pair cannot coexist. The anchor line names the
#             file responsible for the most pairs, which is the finding.
#   INCONCLUSIVE  a merge this verdict needed could not be performed, so no
#             verdict was published. Never reported as CLEAN or BLOCKED.
#
# Exit status:
#   0  CLEAN
#   1  BLOCKED — the queue cannot be landed as it stands
#   2  INCONCLUSIVE, or the check could not start. Never read a 2 as a 0.
#
# Why each of these is a rule this repository already carries, not taste:
#
#   1. A shallow or single-branch clone exits 2 before any merge is attempted.
#      This is the load-bearing line in the file. L-A55: "the clone a seat is
#      given is shallow and single-branch: in it `git merge-base --is-ancestor`
#      finds no base, exits non-zero, and that exit means *not contained* — the
#      opposite of the truth — while `git merge-tree` exits fatal and a loop
#      reads that as a conflict." A loop that reads fatal as conflict reports a
#      whole queue as mutually exclusive and is most confident when it is most
#      wrong. Measured in this repository on 2026-10-25: the clone a seat is
#      handed carries .git/shallow with one commit on main, and
#      `git merge-base main <a seat branch>` printed nothing at all.
#   2. `git merge-tree` exit 1 is a conflict and exit >1 is a failed reading,
#      and the two never share a field (L-A50, L6). Only exit 1 produces
#      EXCLUSIVE. Anything above it prints `unreadable` and forces
#      INCONCLUSIVE.
#   3. Nothing here moves a ref, an index or a working tree. `merge-tree` adds
#      objects to the store and touches nothing a caller can see, which is why
#      it and not `git merge` is the verb (L-E12 — a measurement that moves
#      something is a measurement that broke what it measured). The three hand
#      measurements before this one used real `git merge` in the run's own
#      checkout.
#   4. A missing branch ref is a precondition failure naming the command that
#      fixes it, and `--fetch` is opt-in. Fetching is a write to the caller's
#      refs, so a read-only intention stays read-only in the flags (L-E12), and
#      when this does fetch it never passes `--depth`, which is the flag that
#      leaves somebody else's complete clone shallow for every later reader.
#   5. The sequential pass continues past a blocked pull request rather than
#      stopping. "33 merge in sequence, 51 cannot" is L-A48's own shape of
#      answer, and a loop that halts at the first conflict cannot produce it.
#   6. Both counts print on every verdict, in scope and out (L-A21): "examined
#      the whole queue and found nothing" and "examined nothing" must be
#      different sentences. A queue of one pull request has no pairs, and that
#      prints as pairs=0 rather than as a clean pairwise pass.
#   7. The fix this tool's finding points at is never a merge driver. L-A49
#      measured all three arms: GitHub honours none of them, and `merge=union`
#      destroys records where it does run — two appended entries in, one and a
#      half out, exit 0, no marker. The remedy is L-A48's file layout. The tool
#      says so on the anchor line so the measured-wrong fix is not proposed a
#      fifth time.
#
# Requires: git, and gh only for the live queue — `--prs` replaces it. No npm
# dependencies, by this app's zero-framework ethos.

set -euo pipefail

base=
prs_file=
limit=100
do_fetch=0

while [ $# -gt 0 ]; do
  case "$1" in
    --base)   base="${2:-}"; shift 2 ;;
    --prs)    prs_file="${2:-}"; shift 2 ;;
    --limit)  limit="${2:-}"; shift 2 ;;
    --fetch)  do_fetch=1; shift ;;
    -h|--help) sed -n '2,98p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "merge-order: unknown argument: $1" >&2; exit 2 ;;
  esac
done

die2() { echo "merge-order: $1" >&2; exit 2; }

case "$limit" in
  ''|*[!0-9]*) die2 "--limit wants a whole number of pull requests, got: $limit" ;;
esac

git rev-parse --git-dir >/dev/null 2>&1 || die2 "not a git repository"

# --- precondition: the clone has to be able to answer -----------------------
#
# Divergence 1. A shallow clone makes every merge fatal and a loop reads fatal
# as conflict, so this is checked before any pair is formed and it is a 2.
if [ "$(git rev-parse --is-shallow-repository)" = true ]; then
  echo "INCONCLUSIVE  reason=shallow-clone"
  echo "merge-order: this clone is shallow, so no merge here can be trusted:" >&2
  echo "  a shallow clone has no merge base for a seat branch, and git merge-tree" >&2
  echo "  exits fatal rather than reporting a conflict (L-A55). Run:" >&2
  echo "    git fetch --unshallow origin" >&2
  exit 2
fi

if [ -z "$base" ]; then
  base=$(gh repo view --json defaultBranchRef --jq .defaultBranchRef.name 2>/dev/null || true)
  [ -n "$base" ] || base=main
fi

base_sha=$(git rev-parse --verify --quiet "refs/remotes/origin/$base" \
        || git rev-parse --verify --quiet "$base" || true)
if [ -z "$base_sha" ]; then
  echo "INCONCLUSIVE  reason=no-base base=$base"
  die2 "the base branch '$base' is not in this clone"
fi

# The base tip is a fact the remote owns, not one the clone owns (L13: put every
# reading to the system that owns the answer; a local proxy for a remote fact is
# a cache nobody invalidated). This is divergence 8 and it was measured on this
# tool's own first live run: two pull requests of this seat's own merged at
# 02:27Z while the run was writing the file, so `refs/remotes/origin/main` was
# one commit behind the branch every merge was being measured against, and the
# verdict named `base=main` without saying which commit that was. Every number
# in that run described a queue that no longer existed. A measurement of other
# seats' branches perishes (L-A64), so this one carries its own clock.
remote_base=
if [ -z "$prs_file" ]; then
  remote_base=$(git ls-remote --heads origin "$base" 2>/dev/null | awk '{print $1}' | head -1 || true)
fi
if [ -n "$remote_base" ] && [ "$remote_base" != "$base_sha" ]; then
  if [ "$do_fetch" = 1 ]; then
    git fetch -q origin "+refs/heads/$base:refs/remotes/origin/$base" 2>/dev/null || true
    base_sha=$(git rev-parse --verify --quiet "refs/remotes/origin/$base" || echo "$base_sha")
  fi
  if [ "$base_sha" != "$remote_base" ]; then
    echo "INCONCLUSIVE  reason=stale-base base=$base local=${base_sha:0:8} remote=${remote_base:0:8}"
    echo "merge-order: this clone's $base is behind the remote's, so every merge" >&2
    echo "  below would be measured against a queue that no longer exists. Run:" >&2
    echo "    git fetch origin $base    (or pass --fetch)" >&2
    exit 2
  fi
fi
base_label="$base@${base_sha:0:8}"

# --- reading: the open queue, oldest first ----------------------------------
#
# Oldest first is L-A48's own order. It is also the only order in which the
# answer is actionable: the queue is landed in the order it was opened, so a
# pull request that merges after its predecessors is one a merger can take now.
queue=
if [ -n "$prs_file" ]; then
  [ -f "$prs_file" ] || die2 "--prs file not found: $prs_file"
  queue=$(grep -v '^[[:space:]]*$' "$prs_file" || true)
else
  command -v gh >/dev/null 2>&1 || die2 "gh is not installed, and no --prs file was given"
  gh auth status >/dev/null 2>&1 || die2 "gh is not authenticated, and no --prs file was given"
  queue=$(gh pr list --state open --base "$base" --limit "$limit" \
            --json number,headRefName,headRefOid \
            --jq 'sort_by(.number)|.[]|[.number,.headRefName,.headRefOid]|@tsv' 2>/dev/null) \
    || die2 "could not read the open pull requests from the forge"
fi

# Resolve each row to a local commit. A pull request whose head this clone does
# not hold is a reading that failed, never a pull request that merges.
nums=(); branches=(); tips=(); missing=()
while IFS=$'\t' read -r num branch oid; do
  [ -n "${num:-}" ] || continue
  sha=$(git rev-parse --verify --quiet "${oid:-}^{commit}" \
     || git rev-parse --verify --quiet "refs/remotes/origin/$branch^{commit}" || true)
  if [ -z "$sha" ]; then
    if [ "$do_fetch" = 1 ]; then
      # Divergence 4: a full fetch into an explicit remote-tracking ref. Never
      # --depth, which would leave the caller's complete clone shallow.
      git fetch -q origin "+refs/heads/$branch:refs/remotes/origin/$branch" 2>/dev/null || true
      sha=$(git rev-parse --verify --quiet "refs/remotes/origin/$branch^{commit}" || true)
    fi
  fi
  if [ -z "$sha" ]; then
    missing+=("#$num $branch")
    continue
  fi
  nums+=("$num"); branches+=("$branch"); tips+=("$sha")
done <<< "$queue"

n=${#nums[@]}
in_scope=$n
out_of_scope=${#missing[@]}

for m in "${missing[@]:-}"; do
  [ -n "$m" ] || continue
  echo "UNREADABLE  $m head=not-in-this-clone"
done

if [ "$n" -eq 0 ]; then
  if [ "$out_of_scope" -gt 0 ]; then
    echo "INCONCLUSIVE  in-scope=0 out-of-scope=$out_of_scope base=$base_label"
    echo "merge-order: every open pull request's head is missing from this clone;" >&2
    echo "  re-run with --fetch to bring the branch refs in." >&2
    exit 2
  fi
  echo "CLEAN  in-scope=0 out-of-scope=0 sequence=0/0 exclusive-pairs=0/0 base=$base_label"
  echo "merge-order: no open pull requests against $base, so nothing is in contention." >&2
  exit 0
fi

# --- the merge, twice: in sequence, then every pair --------------------------
#
# merge_probe <a> <b> -> sets probe_tree and probe_files. Returns 0 clean,
# 1 conflicted, 2 unreadable. Divergence 2: exit 1 and exit >1 are different
# answers and this function is the only place that distinction is made.
#
# It assigns rather than prints on purpose. Called as `files=$(merge_probe ...)`
# the body runs in a command-substitution subshell, so the tree oid it resolves
# is discarded with that subshell and the sequential pass carries an empty tree
# into `git commit-tree` — which is a fatal, and divergence 2 then reads the
# fatal as a conflict. That is this file's own rule firing on its first run.
probe_tree=
probe_files=
merge_probe() {
  local a="$1" b="$2" out status
  set +e
  out=$(git merge-tree --write-tree --name-only "$a" "$b" 2>/dev/null)
  status=$?
  set -e
  probe_tree=$(printf '%s\n' "$out" | sed -n '1p')
  probe_files=
  case "$status" in
    0) return 0 ;;
    1) # line 1 is the tree, then the conflicted paths up to the first blank.
       probe_files=$(printf '%s\n' "$out" | sed -n '2,/^$/p' | grep -v '^[[:space:]]*$' || true)
       return 1 ;;
    *) return 2 ;;
  esac
}

declare -A blocks_pairs=()   # file -> pairs it makes exclusive
declare -A blocks_prs=()     # file -> pull requests it appears in
inconclusive=0

# Sequential: carry the accumulated merge forward as a real merge commit, so
# every later merge base is the one a merger would actually get. Divergence 5:
# a blocked pull request is recorded and skipped, never a stop.
acc="$base_sha"
seq_ok=0
order=0
for i in $(seq 0 $((n - 1))); do
  order=$((order + 1))
  merge_probe "$acc" "${tips[$i]}" && rc=0 || rc=$?
  if [ "$rc" = 0 ]; then
    acc=$(git commit-tree "$probe_tree" -p "$acc" -p "${tips[$i]}" -m "merge-order probe")
    seq_ok=$((seq_ok + 1))
    echo "SEQ   #${nums[$i]} ${branches[$i]} merges order=$order"
  elif [ "$rc" = 1 ]; then
    echo "SEQ   #${nums[$i]} ${branches[$i]} blocked order=$order files=$(printf '%s' "$probe_files" | paste -sd, -)"
  else
    inconclusive=1
    echo "SEQ   #${nums[$i]} ${branches[$i]} unreadable order=$order"
  fi
done

# Pairwise: the question GitHub never asks. Each pair is merged on its own
# merge base, which is what "can these two coexist" means.
pairs=0
excl=0
for i in $(seq 0 $((n - 1))); do
  for j in $(seq $((i + 1)) $((n - 1))); do
    [ "$j" -lt "$n" ] || continue
    pairs=$((pairs + 1))
    merge_probe "${tips[$i]}" "${tips[$j]}" && rc=0 || rc=$?
    if [ "$rc" = 1 ]; then
      excl=$((excl + 1))
      echo "EXCLUSIVE  #${nums[$i]} x #${nums[$j]} files=$(printf '%s' "$probe_files" | paste -sd, -)"
      while read -r f; do
        [ -n "$f" ] || continue
        blocks_pairs["$f"]=$(( ${blocks_pairs["$f"]:-0} + 1 ))
        blocks_prs["$f"]="${blocks_prs["$f"]:-} ${nums[$i]} ${nums[$j]}"
      done <<< "$probe_files"
    elif [ "$rc" = 2 ]; then
      inconclusive=1
      echo "UNREADABLE  #${nums[$i]} x #${nums[$j]} merge=fatal"
    fi
  done
done

# --- the anchor, which is the finding ---------------------------------------
anchor=none
anchor_pairs=0
anchor_prs=0
for f in "${!blocks_pairs[@]}"; do
  c=${blocks_pairs["$f"]}
  if [ "$c" -gt "$anchor_pairs" ]; then
    anchor="$f"
    anchor_pairs="$c"
    anchor_prs=$(printf '%s' "${blocks_prs["$f"]}" | tr ' ' '\n' | grep -v '^$' | sort -u | wc -l | tr -d ' ')
  fi
done

if [ "$anchor" != none ]; then
  echo "ANCHOR  $anchor pairs=$anchor_pairs prs=$anchor_prs"
fi

tail="in-scope=$in_scope out-of-scope=$out_of_scope sequence=$seq_ok/$n exclusive-pairs=$excl/$pairs base=$base_label"

if [ "$inconclusive" = 1 ]; then
  echo "INCONCLUSIVE  $tail anchor=$anchor"
  echo "merge-order: at least one merge could not be performed, so the queue got" >&2
  echo "  no verdict. A fatal merge is not a conflict (L-A55)." >&2
  exit 2
fi

if [ "$seq_ok" -lt "$n" ] || [ "$excl" -gt 0 ]; then
  echo "BLOCKED  $tail anchor=$anchor"
  if [ "$anchor" != none ]; then
    echo "merge-order: $anchor blocks the most pairs. The fix is L-A48's file" >&2
    echo "  layout — a dated file per pass under a directory, or one writer on the" >&2
    echo "  shared table. Not a merge driver: L-A49 measured all three arms, GitHub" >&2
    echo "  honours none of them, and merge=union destroys records where it runs." >&2
  fi
  exit 1
fi

echo "CLEAN  $tail anchor=none"
exit 0
