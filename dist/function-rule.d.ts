import AbstractRule from "./abstract-rule";
export default class FunctionRule extends AbstractRule {
    private static readonly fnContext;
    private readonly children;
    constructor(argChildren: AbstractRule[]);
    evaluate: (toCheck: string) => number;
}
