import AbstractRule, { RuleID } from "./abstract-rule";
export default class Rule extends AbstractRule {
    protected fn: (...nums: number[]) => number;
    protected children: {
        groupInd: number;
        children: AbstractRule[];
    }[];
    constructor(regex: RegExp, fn: (...nums: number[]) => number, id: RuleID);
    addChildren: (groupNum: number, ...rules: AbstractRule[]) => void;
    eval: (toEval: string) => number;
}
