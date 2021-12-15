import AbstractRule from "./abstract-rule";
import { BUILTIN_VARS, IDENTIFIER_RE, VarPair } from "./index";

export default class VarRule extends AbstractRule {
  private readonly varContext = new Map<VarPair["name"], VarPair["value"]>(
    BUILTIN_VARS.map(({ name, value }) => [name, value])
  );

  constructor(extraVars?: VarPair[]) {
    super(IDENTIFIER_RE, "VAR");
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
