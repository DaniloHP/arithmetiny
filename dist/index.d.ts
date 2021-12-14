export declare type VarPair = {
    name: string;
    value: number;
};
export declare type FnPair = {
    name: string;
    fn: (...nums: number[]) => number;
};
export declare type Context = {
    vars?: VarPair[];
    functions?: FnPair[];
};
export declare class Arithmetiny {
    private readonly levels;
    constructor(ctx?: Context);
    evaluate: (expr: string) => Promise<number>;
    private populateBinaryRules;
}
