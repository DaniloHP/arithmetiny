"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_rule_1 = __importDefault(require("./abstract-rule"));
class Rule extends abstract_rule_1.default {
    constructor(regex, fn, id) {
        super(regex, id);
        this.addChildren = (groupNum, ...rules) => {
            this.children.push({ groupInd: groupNum, children: rules });
        };
        this.evaluate = (toCheck) => {
            const match = this.regex.exec(toCheck);
            if (toCheck.length > 0 && match !== null) {
                const numChildren = this.children.length;
                if (numChildren === 0) {
                    return +toCheck;
                }
                const resultVector = new Array(numChildren).fill(NaN);
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
        this.children = [];
        this.fn = fn;
    }
}
exports.default = Rule;
