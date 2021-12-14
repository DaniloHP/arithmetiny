import AbstractRule from "./abstract-rule";
import { FnPair } from "./index";

export default class FunctionRule extends AbstractRule {
  private readonly fnContext = new Map<string, (...nums: number[]) => number>([
    ["ln", Math.log],
    ["log", (num: number, base: number) => Math.log(num) / Math.log(base)], //log base n
    ["sin", Math.sin],
    ["cos", Math.cos],
    ["tan", Math.tan],
    ["sqrt", Math.sqrt],
    ["abs", Math.abs],
  ]);

  private readonly children: AbstractRule[];

  constructor(argChildren: AbstractRule[], extraFns?: FnPair[]) {
    super(/^ *([a-zA-Z_][\w]{0,31})\(([+\-*/^%\w ,()]*)\) *$/, "FUNCTION");
    this.children = argChildren;
    if (extraFns) {
      for (const { name, fn } of extraFns) {
        if (AbstractRule.IDENTIFIER_RE.test(name)) {
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

  public eval = (toEval: string): number => {
    const match = this.regex.exec(toEval);
    if (match) {
      const [, fnName, fnArgs] = match;
      const fn = this.fnContext.get(fnName);
      if (fn) {
        const args = fnArgs.split(/ *, */);
        if (this.argsConflict(args, fn.length)) {
          throw Error(
            `Function ${fnName} expected ${fn.length} argument(s), got ${args.length}`
          );
        } else if (fn.length === 0) {
          return fn();
        }
        const evalItems = args.map((a) => {
          return { toEval: a, children: this.children };
        });
        return this.evalChildren(evalItems, fn);
      } else {
        throw new Error(`Function "${fnName}" is not defined`);
      }
    }
    return NaN;
  };
}
