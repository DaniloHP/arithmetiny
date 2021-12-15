export declare type VarPair = {
    name: string;
    value: number;
};
export declare type FnPair = {
    name: string;
    fn: (...nums: number[]) => number;
};
export interface Context {
    vars?: VarPair[];
    functions?: FnPair[];
}
export declare class Arithmetiny {
    private readonly topLevel;
    private static readonly symbolToID;
    private setUpGrammar;
    constructor(ctx?: Context);
    setContext: (ctx: Context) => void;
    evaluate: (expr: string) => Promise<number>;
    private fillNeededBranches;
    private populateBinaryRules;
}
