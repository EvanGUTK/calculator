# Tasks

Status flow: `[TODO]` -> `[IN_PROGRESS by <Role>]` -> `[COMPLETED]`. Update only your own rows (commit TASKS.md changes together with your module commit).

| ID | Owner | Task | Depends on | Status |
|----|-------|------|------------|--------|
| T0 | LEAD | Repo init, docs, shared types, tooling | - | [COMPLETED] |
| T1 | ENGINE | Tokenizer, shunting-yard parser, evaluator, sci + financial functions (`src/engine/`) | T0 | [TODO] |
| T2 | STORAGE | VariableStore, FileLock, Database/history.json (`src/storage/`) | T0 | [TODO] |
| T3 | UI | Session controller, HTTP server, web dashboard (`src/ui/`) | T0; integrates T1,T2 | [TODO] |
| T4 | QA | Unit + integration tests (`src/tests/`) | T0; integrates T1-T3 | [TODO] |
| T5 | LEAD | Integration, full `npm test`, typecheck, CodeRabbit review, live port verification, push | T1-T4 | [TODO] |
