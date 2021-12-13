export default abstract class AbstractRule {
  protected regex: RegExp;
  protected id: string;

  protected constructor(regex: RegExp, id: string) {
    this.regex = regex;
    this.id = id;
  }

  protected allNotNaN = (arr: number[]): boolean => {
    for (const n of arr) {
      if (isNaN(n)) {
        return false;
      }
    }
    return true;
  };

  public abstract evaluate: (toCheck: string) => number;

  public toString = (): string => this.id;
}
