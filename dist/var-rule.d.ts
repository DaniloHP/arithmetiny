import AbstractRule from "./abstract-rule";
declare type VarPair = [string, number];
export default class VarRule extends AbstractRule {
    private static readonly varContext;
    constructor(...vars: VarPair[]);
    evaluate: (toCheck: string) => number;
}
export {};
