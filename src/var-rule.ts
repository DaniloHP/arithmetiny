import AbstractRule from "./abstract-rule";

type VarPair = [string, number];

export default class VarRule extends AbstractRule {
  private static readonly varContext = new Map<string, number>([
    ["e", Math.E],
    ["pi", Math.PI],
  ]);

  constructor(...vars: VarPair[]) {
    super(/^ *([a-zA-Z_][\w]{0,31}) *$/, "VAR");
    for (const [name, value] of vars) {
      VarRule.varContext.set(name, value);
    }
  }

  public evaluate = (toCheck: string): number => {
    const res = this.regex.exec(toCheck);
    if (toCheck.length > 0 && res !== null) {
      const varName = res[0];
      const varVal = VarRule.varContext.get(varName);
      if (varVal !== undefined) {
        return varVal;
      }
    }
    return NaN;
  };
}
