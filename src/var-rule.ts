import AbstractRule from "./abstract-rule";
import { VarPair } from "./index";

export default class VarRule extends AbstractRule {
  private readonly varContext = new Map<VarPair["name"], VarPair["value"]>([
    ["e", Math.E],
    ["pi", Math.PI],
  ]);

  constructor(extraVars?: VarPair[]) {
    super(AbstractRule.IDENTIFIER_RE, "VAR");
    if (extraVars) {
      for (const { name, value } of extraVars) {
        if (this.regex.test(name)) {
          this.varContext.set(name, value);
        } else {
          throw new Error(
            `Given variable "${name}" has an invalid identifier.`
          );
        }
      }
    }
  }

  public eval = (toEval: string): number => {
    const match = this.regex.exec(toEval);
    if (match) {
      const varVal = this.varContext.get(match[1]);
      if (varVal !== undefined) {
        return varVal;
      } else {
        throw new Error(`Variable "${match[1]}" is not defined.`);
      }
    }
    return NaN;
  };
}
