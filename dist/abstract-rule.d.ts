export default abstract class AbstractRule {
    protected regex: RegExp;
    protected id: string;
    protected constructor(regex: RegExp, id: string);
    protected allNotNaN: (arr: number[]) => boolean;
    abstract evaluate: (toCheck: string) => number;
    toString: () => string;
}
