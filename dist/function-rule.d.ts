import AbstractRule from "./abstract-rule";
import { FnPair } from "./index";
export default class FunctionRule extends AbstractRule {
    private readonly fnContext;
    private readonly children;
    constructor(argChildren: AbstractRule[], extraFns?: FnPair[]);
    private argsConflict;
    eval: (toEval: string) => number;
}
