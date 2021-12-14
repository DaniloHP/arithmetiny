export default abstract class AbstractRule {
  protected regex: RegExp;
  protected id: string;
  protected static readonly IDENTIFIER_RE = /^ *([a-zA-Z_][\w]{0,31}) *$/;

  protected constructor(regex: RegExp, id: RuleID) {
    this.regex = regex;
    this.id = id;
  }

  public abstract eval: (toEval: string) => number;

  protected evalChildren = (
    evalItems: { toEval: string; children: AbstractRule[] }[],
    fn: (...nums: number[]) => number
  ): number => {
    const resultVector = evalItems.map(() => NaN);
    for (let i = 0; i < evalItems.length; i++) {
      const { toEval, children } = evalItems[i];
      for (const rule of children) {
        resultVector[i] = rule.eval(toEval);
        if (!isNaN(resultVector[i])) {
          if (i + 1 === resultVector.length) {
            return fn(...resultVector);
          }
          break;
        }
      }
      if (isNaN(resultVector[i])) {
        return NaN;
      }
    }
    return NaN;
  };
}

export type RuleID =
  | "ADD"
  | "ADD_RIGHT"
  | "SUB"
  | "SUB_RIGHT"
  | "AS_DOWN"
  | "MULT"
  | "MULT_RIGHT"
  | "DIV"
  | "DIV_RIGHT"
  | "MOD"
  | "MOD_RIGHT"
  | "MMD_DOWN"
  | "EXP"
  | "EXP_RIGHT"
  | "EXP_DOWN"
  | "PAREN"
  | "NEGATIVE"
  | "NUMBER"
  | "FUNCTION"
  | "VAR";
