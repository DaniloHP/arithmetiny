"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_rule_1 = __importDefault(require("./abstract-rule"));
class VarRule extends abstract_rule_1.default {
    constructor(...vars) {
        super(/^ *([a-zA-Z_][\w]{0,31}) *$/, "VAR");
        this.evaluate = (toCheck) => {
            const res = this.regex.exec(toCheck);
            if (toCheck.length > 0 && res !== null) {
                const varName = res[0];
                const varVal = VarRule.varContext.get(varName);
                if (varVal !== undefined) {
                    return varVal;
                }
            }
            return NaN;
        };
        for (const [name, value] of vars) {
            VarRule.varContext.set(name, value);
        }
    }
}
exports.default = VarRule;
VarRule.varContext = new Map([
    ["e", Math.E],
    ["pi", Math.PI],
]);
