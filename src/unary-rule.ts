import Rule from "./rule";

export default class UnaryRule extends Rule {
  private fn: (a: number) => number;

  constructor(regex: RegExp, fn: (a: number) => number, id: string) {
    super(regex, id);
    this.fn = fn;
  }

  public evaluate = (toCheck: string): number => {
    const res = this.regex.exec(toCheck);
    if (toCheck.length > 0 && res !== null) {
      const numChildren = this.children.length;
      if (numChildren === 0) {
        return +toCheck;
      }
      let resultVector: number = NaN;
      let i = 0;
      for (const { groupInd, children } of this.children) {
        const currGroup = res[groupInd];
        for (const rule of children) {
          const result = rule.evaluate(currGroup);
          if (!isNaN(result)) {
            resultVector = result;
            return this.fn(result);
          }
        }
        if (isNaN(resultVector)) {
          return NaN;
        }
        i++;
      }
    }
    return NaN;
  };
}
