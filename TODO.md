commit 1: rename POST /patient → POST /patients (REST consistency)
commit 2: add soft-delete filter to GET /vitals
commit 3: refactor GET /vitals → GET /patients with JOIN to latest reading
commit 4: update frontend to call new endpoints
commit 5: fix the 4 original bugs (form state, reconnect backoff, cleanup, loading/error)
commit 6: run fresh-context audit prompt with Claude Code
commit 7: fix audit findings
commit 8: write LEARNINGS.md and basic README
