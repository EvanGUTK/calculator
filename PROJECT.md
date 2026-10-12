# Financial & Scientific Calculator

Zero-dependency calculator: custom AST math engine, JSON persistence, web dashboard. Node >= 24 (native TypeScript type stripping), no npm runtime or dev dependencies.

## Features
- Expressions: `+ - * / ^ %`, unary minus, parentheses, implicit constants `pi`, `e`.
- Variables: `x = 42`, `rate = 0.05`, usable in later expressions.
- Scientific: `sin cos tan asin acos atan` (rad/deg), `ln log10 exp sqrt abs`, `fact(n)` and postfix `n!`, `^` exponent.
- Financial: `compound(P, r, n, t)` = P(1 + r/n)^(nt); `pmt(P, r, n)` amortization payment per period; `npv(r, c0, c1, ...)` = sum C_t/(1+r)^t.
- History: timestamped entries (input, output) persisted to `history.json` with lock-file protection.
- UI: web dashboard, live syntax validation (unbalanced parens, invalid syntax) before evaluation, variable panel, scrollable history.

## Rules
No `eval()`/`Function()`, no placeholders, strict TypeScript, atomic commits `<type>(<scope>): <summary>`, all verification local (no CI).

## Run
`npm start` (default port 4317, bound to 0.0.0.0) · `npm test` · `npm run typecheck`
