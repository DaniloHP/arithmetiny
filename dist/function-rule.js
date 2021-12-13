"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_rule_1 = __importDefault(require("./abstract-rule"));
class FunctionRule extends abstract_rule_1.default {
    constructor(argChildren) {
        super(/^ *([a-zA-Z_][\w]{0,31})\(([+\-*/^%\w ,()]+)\) *$/, "FUNCTION");
        this.evaluate = (toCheck) => {
            const res = this.regex.exec(toCheck);
            if (toCheck.length > 0 && res !== null) {
                const fnName = res[1];
                const fnArgs = res[2].trim();
                const fn = FunctionRule.fnContext.get(fnName);
                if (fn) {
                    const args = fnArgs.split(/ *, */);
                    if (args.length !== fn.length) {
                        throw Error(`Function ${fnName} expected ${fn.length} argument(s), got ${args.length}`);
                    }
                    const resultVector = new Array(args.length).fill(NaN);
                    let i = 0;
                    for (const arg of args) {
                        for (const rule of this.children) {
                            const result = rule.evaluate(arg);
                            if (!isNaN(result)) {
                                resultVector[i] = result;
                                if (this.allNotNaN(resultVector)) {
                                    return fn(...resultVector);
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
            }
            return NaN;
        };
        this.children = argChildren;
    }
}
exports.default = FunctionRule;
FunctionRule.fnContext = new Map([
    ["floor", Math.floor],
    ["ceil", Math.ceil],
    ["ln", Math.log],
    ["log10", Math.log10],
    ["log", (num, base) => Math.log(num) / Math.log(base)],
    ["sin", Math.sin],
    ["cos", Math.cos],
    ["tan", Math.tan],
    ["sqrt", Math.sqrt],
    ["abs", Math.abs],
]);
