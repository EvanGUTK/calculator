# Architecture

Layers (no upward imports): `types.ts` <- `engine` | `storage` <- `ui` (controller) <- `ui` (server/web). `engine` and `storage` MUST NOT import each other.

TypeScript conventions (Node type stripping): relative imports include `.ts`; use `import type` for types; no enums, namespaces, or parameter properties (erasable syntax only). Shared contracts live in `src/types.ts`.

## src/engine/ (Teammate 1)
Files: `tokenizer.ts`, `parser.ts` (shunting-yard -> AST), `evaluator.ts`, `functions.ts`, `errors.ts`, `index.ts`.
Public API (`index.ts`):
```ts
export class CalcError extends Error { readonly kind: 'syntax'|'math'|'name'|'arity'; readonly span?: Span }
export function evaluate(input: string, ctx: EvalContext): EvalResult   // handles `name = expr`; throws CalcError
export function validate(input: string): ValidationResult               // syntax only; collects issues, never throws
export function formatNumber(n: number): string                          // up to 12 significant digits, trims float noise
```
Reserved names (cannot be assigned): `pi`, `e`, and all function names. Division by zero, `ln(<=0)`, `fact` of negative/non-integer or > 170, `asin/acos` out of domain, non-finite results -> `CalcError('math')`. Unknown variable -> `'name'`. Wrong argument count -> `'arity'`.
Financial: `compound(P,r,n,t)`, `pmt(P,r,n)` (r = periodic rate; r=0 -> P/n), `npv(r, c0, c1, ...)` with C_t discounted by (1+r)^t, t starting at 0.
Angle mode applies to sin/cos/tan (input) and asin/acos/atan (output).

## src/storage/ (Teammate 2)
Files: `variable-store.ts`, `history-store.ts`, `file-lock.ts`, `persistence.ts`, `index.ts`.
```ts
export class VariableStore { get(name); set(name, value); delete(name); has(name); toMap(): ReadonlyMap<string, number>; toRecord(): Record<string, number>; clear() }
export class FileLock { static async withLock<T>(lockPath: string, fn: () => Promise<T>, opts?: { timeoutMs?: number; staleMs?: number }): Promise<T> }
export class Database {            // owns history.json (PersistedState)
  constructor(filePath: string, opts?: { maxHistory?: number; now?: () => Date })
  async load(): Promise<PersistedState>           // missing file -> empty state; corrupt file -> throws StorageError
  async appendHistory(input: string, output: string, ok: boolean): Promise<HistoryEntry>
  async saveVariables(vars: Record<string, number>): Promise<void>
  async clearHistory(): Promise<void>
}
export class StorageError extends Error {}
```
Locking: exclusive-create lock file `<file>.lock` (`open` flag `wx`) with stale-lock takeover and timeout; writes are read-modify-write inside the lock, written to a temp file then `rename` (atomic). Concurrent appenders must never lose entries; ids are monotonically increasing.

## src/ui/ (Teammate 3)
Files: `session.ts` (controller), `server.ts` (HTTP, node:http), `public/index.html|app.js|style.css`.
`CalculatorSession` (`session.ts`): `static async open(dbPath)`; `async submit(input): Promise<HistoryEntry & { value?: number }>` (evaluates via engine, updates VariableStore + persists variables, appends history incl. errors); `validate(input)`; `getState()`; `setAngleMode(m)`; `clearHistory()`.
HTTP API (JSON): `POST /api/eval {input}`, `POST /api/validate {input}`, `GET /api/state` (variables, history, angleMode), `POST /api/angle {mode}`, `POST /api/history/clear`. Static files from `src/ui/public/` with path-traversal protection. Bind `0.0.0.0`, port from `PORT` env (default 4317), DB path from `CALC_DB` env (default `./history.json`). Request body limit 64 KiB. Client renders with `textContent` (no innerHTML of user data).
Web client: live validation on each keystroke (debounced call or local check via `/api/validate`), highlights error span, variables panel, scrollable history (click to reuse).

## src/tests/ (Teammate 3)
`node:test` + `node:assert/strict`. Files `engine.*.test.ts`, `storage.*.test.ts`, `ui.*.test.ts`. Use temp dirs (`fs.mkdtemp`). Cover: all operations, float precision (`0.1+0.2` formatting, tolerance helper), div-by-zero, illegal input, lock concurrency, session -> history.json integration, HTTP API integration.
