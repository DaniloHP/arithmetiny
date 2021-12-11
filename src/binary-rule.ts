import Rule from "./rule";

export default class BinaryRule extends Rule {
  protected fn: (...nums: number[]) => number;

  constructor(regex: RegExp, fn: (...nums: number[]) => number, id: string) {
    super(regex, id);
    this.fn = fn;
  }

  public evaluate = (toCheck: string): number => {
    const match = this.regex.exec(toCheck);
    if (toCheck.length > 0 && match !== null) {
      const numChildren = this.children.length;
      if (numChildren === 0) {
        return +toCheck;
      }
      const resultVector = new Array<number>(numChildren).fill(NaN);
      let i = 0;
      for (const { groupInd, children } of this.children) {
        const currGroup = match[groupInd];
        for (const rule of children) {
          const result = rule.evaluate(currGroup);
          if (!isNaN(result)) {
            resultVector[i] = result;
            if (this.allNotNaN(resultVector)) {
              return this.fn(...resultVector);
            }
            break;
          }
        }
        if (isNaN(resultVector[i])) {
          return NaN;
        }
        i++;
      }
    }
    return NaN;
  };
}
