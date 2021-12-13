import AbstractRule from "./abstract-rule";
export default class Rule extends AbstractRule {
    protected fn: (...nums: number[]) => number;
    protected children: {
        groupInd: number;
        children: AbstractRule[];
    }[];
    constructor(regex: RegExp, fn: (...nums: number[]) => number, id: string);
    addChildren: (groupNum: number, ...rules: AbstractRule[]) => void;
    evaluate: (toCheck: string) => number;
}
