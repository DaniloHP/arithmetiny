import AbstractRule from "./abstract-rule";
import { VarPair } from "./index";
export default class VarRule extends AbstractRule {
    private readonly varContext;
    constructor(extraVars?: VarPair[]);
    eval: (toEval: string) => number;
}
