export default abstract class AbstractRule {
  protected regex: RegExp;
  protected id: string;
  protected children: { groupInd: number; children: AbstractRule[] }[];

  protected constructor(regex: RegExp, id: string) {
    this.regex = regex;
    this.id = id;
    this.children = [];
  }

  protected allNotNaN = (arr: number[]): boolean => {
    for (const n of arr) {
      if (isNaN(n)) {
        return false;
      }
    }
    return true;
  };

  public addChildren = (groupNum: number, ...rules: AbstractRule[]) => {
    this.children.push({ groupInd: groupNum, children: rules });
  };

  public abstract evaluate: (toCheck: string) => number;

  public toString = (): string => this.id;
}
