import AbstractRule from "./abstract-rule";
import { BUILTIN_FUNCTIONS, FnPair, IDENTIFIER_RE } from "./index";

export default class FunctionRule extends AbstractRule {
  private readonly fnContext = new Map<string, (...nums: number[]) => number>(
    BUILTIN_FUNCTIONS.map(({ name, fn }) => [name, fn])
  );

  private readonly children: AbstractRule[];

  constructor(argChildren: AbstractRule[], extraFns?: FnPair[]) {
    super(/^([a-zA-Z_][\w]{0,31})(\(.*\))$/, "FUNCTION");
    this.children = argChildren;
    if (extraFns) {
      for (const { name, fn } of extraFns) {
        if (IDENTIFIER_RE.test(name)) {
          this.fnContext.set(name, fn);
        } else {
          throw new Error(
            `Given function "${name}" has an invalid identifier.`
          );
        }
      }
    }
  }

  private argsConflict = (args: string[], expected: number): boolean => {
    if (args.length > 1) {
      return args.length !== expected;
    } else if (/^\s*$/.test(args[0])) {
      // Can now assume args.length == 1 because string.split() will always be
      // at least of length 1 when no limit is provided
      return expected !== 0;
    }
    return expected !== 1;
  };

  private parMatch = (args: string): number => {
    const open = 40; // (
    const close = 41; // )
    let stack = 0;
    let last = 0;
    for (let i = 0; i < args.length && stack >= 0; i++) {
      const pt = args.codePointAt(i);
      if (pt === open) {
        stack++;
      } else if (pt === close) {
        stack--;
        last = i;
      }
    }
    return stack === 0 ? last : -1;
  };

  public eval = (toEval: string): number => {
    const match = this.regex.exec(toEval);
    if (match) {
      const argsEnd = this.parMatch(match[2]);
      if (argsEnd >= 1) {
        const fn = this.fnContext.get(match[1]);
        const fnArgs = match[2].substring(1, argsEnd);
        if (fn) {
          const args = fnArgs.split(/ *, */);
          if (this.argsConflict(args, fn.length)) {
            throw Error(
              `Function ${match[1]} expected ${fn.length} argument(s), got ${args.length}: "${fnArgs}"`
            );
          } else if (fn.length === 0) {
            return fn();
          }
          const evalItems = args.map((a) => {
            return { toEval: a, children: this.children };
          });
          return this.evalChildren(evalItems, fn);
        } else {
          throw new Error(`Function "${match[1]}" is not defined`);
        }
      }
    }
    return NaN;
  };
}
