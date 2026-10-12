/** Shared contracts. Owned by LEAD; teammates must not change without updating ARCHITECTURE.md. */

export type AngleMode = 'rad' | 'deg';

/** Everything the engine needs from the outside world to evaluate an expression. */
export interface EvalContext {
  readonly variables: ReadonlyMap<string, number>;
  readonly angleMode: AngleMode;
}

/** Outcome of evaluating one input line (expression or `name = expression`). */
export interface EvalResult {
  readonly kind: 'expression' | 'assignment';
  readonly value: number;
  /** Present only when kind === 'assignment'. */
  readonly assignedName?: string;
}

/** Source span inside the raw input, [start, end) in UTF-16 code units. */
export interface Span {
  readonly start: number;
  readonly end: number;
}

export interface SyntaxIssue {
  readonly message: string;
  readonly span: Span;
}

/** Result of validating input without evaluating it (no variable lookups, no math errors). */
export interface ValidationResult {
  readonly valid: boolean;
  readonly issues: readonly SyntaxIssue[];
}

export interface HistoryEntry {
  readonly id: number;
  /** ISO-8601 timestamp. */
  readonly timestamp: string;
  readonly input: string;
  /** Formatted result, or error message when ok === false. */
  readonly output: string;
  readonly ok: boolean;
}

export interface PersistedState {
  readonly version: 1;
  readonly variables: Readonly<Record<string, number>>;
  readonly history: readonly HistoryEntry[];
}
