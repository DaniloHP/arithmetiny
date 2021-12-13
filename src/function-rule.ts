import AbstractRule from "./abstract-rule";

export default class FunctionRule extends AbstractRule {
  private static readonly fnContext = new Map<
    string,
    (...nums: number[]) => number
  >([
    ["floor", Math.floor],
    ["ceil", Math.ceil],
    ["ln", Math.log],
    ["log10", Math.log10],
    ["log", (num: number, base: number) => Math.log(num) / Math.log(base)],
    ["sin", Math.sin],
    ["cos", Math.cos],
    ["tan", Math.tan],
    ["sqrt", Math.sqrt],
    ["abs", Math.abs],
  ]);

  private readonly children: AbstractRule[];

  constructor(argChildren: AbstractRule[]) {
    super(/^ *([a-zA-Z_][\w]{0,31})\(([+\-*/^%\w ,()]+)\) *$/, "FUNCTION");
    this.children = argChildren;
  }

  public evaluate = (toCheck: string): number => {
    const res = this.regex.exec(toCheck);
    if (toCheck.length > 0 && res !== null) {
      const fnName = res[1];
      const fnArgs = res[2].trim();
      const fn = FunctionRule.fnContext.get(fnName);
      if (fn) {
        const args = fnArgs.split(/ *, */);
        if (args.length !== fn.length) {
          throw Error(
            `Function ${fnName} expected ${fn.length} argument(s), got ${args.length}`
          );
        }
        const resultVector = new Array<number>(args.length).fill(NaN);
        let i = 0;
        for (const arg of args) {
          for (const rule of this.children) {
            const result = rule.evaluate(arg);
            if (!isNaN(result)) {
              resultVector[i] = result;
              if (this.allNotNaN(resultVector)) {
                return fn(...resultVector);
              }
              break;
            }
          }
          if (isNaN(resultVector[i])) {
            return NaN;
          }
          i++;
        }
      }
    }
    return NaN;
  };
}
