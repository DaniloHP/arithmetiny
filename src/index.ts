import AbstractRule from "./abstract-rule";
import FunctionRule from "./function-rule";
import Rule from "./rule";
import VarRule from "./var-rule";

export type VarPair = { name: string; value: number };
export type FnPair = { name: string; fn: (...nums: number[]) => number };

export type Context = {
  vars?: VarPair[];
  functions?: FnPair[];
};

export class Arithmetiny {
  private readonly levels: AbstractRule[][];

  constructor(ctx?: Context) {
    const ident = (a: number) => a;
    const down = /^ *(.+) *$/;
    const addRule = new Rule(/^ *(.+) *\+ *(.+) *$/, (a, b) => a + b, "ADD");
    const addRuleRight = new Rule(
      /^ *(.+?) *\+ *(.+) *$/,
      (a, b) => a + b,
      "ADD_RIGHT"
    );
    const subRule = new Rule(/^ *(.+) *- *(.+) *$/, (a, b) => a - b, "SUB");
    const subRuleRight = new Rule(
      /^ *(.+?) *- *(.+) *$/,
      (a, b) => a - b,
      "SUB_RIGHT"
    );
    const asDownRule = new Rule(down, ident, "AS_DOWN");
    const asExpr = [addRule, addRuleRight, subRule, subRuleRight, asDownRule];

    const mulRule = new Rule(/^ *(.+) *\* *(.+) *$/, (a, b) => a * b, "MULT");
    const mulRuleRight = new Rule(
      /^ *(.+?) *\* *(.+) *$/,
      (a, b) => a * b,
      "MULT_RIGHT"
    );
    const divRule = new Rule(/^ *(.+) *\/ *(.+) *$/, (a, b) => a / b, "DIV");
    const divRuleRight = new Rule(
      /^ *(.+?) *\/ *(.+) *$/,
      (a, b) => a / b,
      "DIV_RIGHT"
    );
    const modRule = new Rule(/^ *(.+) *% *(.+) *$/, (a, b) => a % b, "MOD");
    const modRuleRight = new Rule(
      /^ *(.+?) *% *(.+) *$/,
      (a, b) => a % b,
      "MOD_RIGHT"
    );
    const mmdDownRule = new Rule(down, ident, "MMD_DOWN");
    const mmdExpr = [
      mulRule,
      mulRuleRight,
      divRule,
      divRuleRight,
      modRule,
      modRuleRight,
      mmdDownRule,
    ];

    const expRule = new Rule(/^ *(.+) *\^ *(.+) *$/, Math.pow, "EXP");
    const expRuleRight = new Rule(
      /^ *(.+?) *\^ *(.+) *$/,
      Math.pow,
      "EXP_RIGHT"
    );
    const expDownRule = new Rule(down, ident, "EXP_DOWN");
    const expExpr = [expRule, expRuleRight, expDownRule];

    const parenRule = new Rule(/^ *\((.+)\) *$/, ident, "PAREN");
    const negRule = new Rule(/^ *-(?!-.+)(.+) *$/, (a) => -a, "NEGATIVE");
    const scalar = new Rule(
      /^ *?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)? *$/,
      ident,
      "NUMBER"
    );
    const vars = new VarRule(ctx && ctx.vars);
    const functions = new FunctionRule(asExpr, ctx && ctx.functions);
    const rootExpr = [parenRule, negRule, scalar, vars, functions];

    this.populateBinaryRules(
      asExpr,
      mmdExpr,
      addRule,
      addRuleRight,
      subRule,
      subRuleRight
    );
    asDownRule.addChildren(1, ...mmdExpr);
    this.populateBinaryRules(
      mmdExpr,
      expExpr,
      mulRule,
      mulRuleRight,
      divRule,
      divRuleRight,
      modRule,
      modRuleRight
    );
    mmdDownRule.addChildren(1, ...expExpr);
    this.populateBinaryRules(rootExpr, expExpr, expRule, expRuleRight);
    expDownRule.addChildren(1, ...rootExpr);
    parenRule.addChildren(1, ...asExpr);
    negRule.addChildren(1, ...asExpr);
    this.levels = [asExpr, mmdExpr, expExpr, rootExpr];
  }

  public evaluate = async (expr: string): Promise<number> =>
    Promise.resolve().then(() => {
      for (const rule of this.levels[0]) {
        const result = rule.eval(expr);
        if (!isNaN(result)) {
          return result;
        }
      }
      return NaN;
    });

  private populateBinaryRules = (
    left: AbstractRule[],
    right: AbstractRule[],
    ...toPopulate: Rule[]
  ) => {
    toPopulate.forEach((rule) => {
      rule.addChildren(1, ...left);
      rule.addChildren(2, ...right);
    });
  };
}
