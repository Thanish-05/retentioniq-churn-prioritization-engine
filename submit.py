#!/usr/bin/env python3
"""
RETENTIONIQ Auto-Submit Tool
Automatically stages and commits all changes without requiring manual user input.
"""

import os
import sys
from datetime import datetime
from dulwich import porcelain
from dulwich.repo import Repo

def auto_submit(commit_message=None):
    repo_path = os.path.abspath(".")
    
    # Initialize or open repo
    try:
        repo = Repo(repo_path)
    except Exception:
        print("Initializing new Git repository...")
        repo = porcelain.init(repo_path)

    # Set user info if not already configured
    config = repo.get_config()
    try:
        config.get((b"user",), b"name")
    except KeyError:
        config.set((b"user",), b"name", b"Keerthivasan")
        config.set((b"user",), b"email", b"keerthivasan@retentioniq.local")
        config.write_to_path()

    # Discover and stage all untracked and modified files
    status = porcelain.status(repo_path)
    untracked = [x.decode("utf-8") for x in status.untracked]
    unstaged = [x.decode("utf-8") for x in status.unstaged]

    if not untracked and not unstaged and not any(status.staged.values()):
        print("[OK] Everything is already up to date. Working tree clean!")
        return True

    print(f"Staging changes ({len(untracked)} untracked, {len(unstaged)} modified)...")
    
    # Add all files that are tracked or newly added
    porcelain.add(repo_path)

    # Re-check status after staging
    status = porcelain.status(repo_path)
    total_staged = len(status.staged.get("add", [])) + len(status.staged.get("modify", [])) + len(status.staged.get("delete", []))

    if total_staged == 0:
        print("[OK] No staged changes to commit.")
        return True

    # Generate commit message if not provided
    if not commit_message:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        commit_message = f"chore: Auto-update {timestamp} - {total_staged} files"

    print(f"Committing {total_staged} files with message: '{commit_message}'...")
    commit_id = porcelain.commit(repo_path, message=commit_message.encode("utf-8"))
    
    # Ensure main branch is referenced
    try:
        repo.refs[b"refs/heads/main"] = commit_id
    except Exception:
        porcelain.branch_create(repo_path, b"main")
    
    repo.refs.set_symbolic_ref(b"HEAD", b"refs/heads/main")
    
    print(f"[SUCCESS] Committed successfully! Commit SHA: {commit_id.decode('utf-8')[:8]}")
    return True

if __name__ == "__main__":
    msg = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else None
    auto_submit(msg)
