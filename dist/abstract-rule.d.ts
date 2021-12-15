export default abstract class AbstractRule {
    protected regex: RegExp;
    protected id: RuleID;
    protected static readonly IDENTIFIER_RE: RegExp;
    static neededBranches: Set<RuleID>;
    protected constructor(regex: RegExp, id: RuleID);
    abstract eval: (toEval: string) => number;
    protected evalChildren: (evalItems: {
        toEval: string;
        children: AbstractRule[];
    }[], fn: (...nums: number[]) => number) => number;
}
export declare type RuleID = "ADD" | "ADD_RIGHT" | "SUB" | "SUB_RIGHT" | "AS_DOWN" | "MULT" | "MULT_RIGHT" | "DIV" | "DIV_RIGHT" | "MOD" | "MOD_RIGHT" | "MMD_DOWN" | "EXP" | "EXP_RIGHT" | "EXP_DOWN" | "PAREN" | "NEGATIVE" | "NUMBER" | "FUNCTION" | "VAR";
