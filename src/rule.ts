import AbstractRule, { RuleID } from "./abstract-rule";

export default class Rule extends AbstractRule {
  protected fn: (...nums: number[]) => number;
  protected children: { groupInd: number; children: AbstractRule[] }[];

  constructor(regex: RegExp, fn: (...nums: number[]) => number, id: RuleID) {
    super(regex, id);
    this.children = [];
    this.fn = fn;
  }

  public addChildren = (groupNum: number, ...rules: AbstractRule[]) => {
    this.children.push({ groupInd: groupNum, children: rules });
  };

  public eval = (toEval: string): number => {
    const match = this.regex.exec(toEval);
    if (match) {
      const numChildren = this.children.length;
      if (numChildren === 0) {
        return +toEval;
      }
      const evalItems = this.children.map(({ children, groupInd }) => {
        return { children: children, toEval: match[groupInd] };
      });
      return this.evalChildren(evalItems, this.fn);
    }
    return NaN;
  };
}
