"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathGrammar = void 0;
const function_rule_1 = __importDefault(require("./function-rule"));
const rule_1 = __importDefault(require("./rule"));
const var_rule_1 = __importDefault(require("./var-rule"));
class MathGrammar {
    constructor() {
        this.evaluate = (expr) => {
            for (const rule of this.levels[0]) {
                const result = rule.evaluate(expr);
                if (!isNaN(result)) {
                    return result;
                }
            }
            return NaN;
        };
        this.populateBinaryRules = (left, right, ...toPopulate) => {
            toPopulate.forEach((rule) => {
                rule.addChildren(1, ...left);
                rule.addChildren(2, ...right);
            });
        };
        const ident = (a) => a;
        const down = /^ *(.*) *$/;
        const addRule = new rule_1.default(/^ *(.*) *\+ *(.*) *$/, (a, b) => a + b, 'ADD');
        const addRuleRight = new rule_1.default(/^ *(.*?) *\+ *(.*) *$/, (a, b) => a + b, 'ADD_RIGHT');
        const subRule = new rule_1.default(/^ *(.*) *- *(.*) *$/, (a, b) => a - b, 'SUB');
        const subRuleRight = new rule_1.default(/^ *(.*?) *- *(.*) *$/, (a, b) => a - b, 'SUB_RIGHT');
        const asDownRule = new rule_1.default(down, ident, 'AS_DOWN');
        const asExpr = [addRule, addRuleRight, subRule, subRuleRight, asDownRule];
        const mulRule = new rule_1.default(/^ *(.*) *\* *(.*) *$/, (a, b) => a * b, 'MULT');
        const mulRuleRight = new rule_1.default(/^ *(.*?) *\* *(.*) *$/, (a, b) => a * b, 'MULT_RIGHT');
        const divRule = new rule_1.default(/^ *(.*) *\/ *(.*) *$/, (a, b) => a / b, 'DIV');
        const divRuleRight = new rule_1.default(/^ *(.*?) *\/ *(.*) *$/, (a, b) => a / b, 'DIV_RIGHT');
        const modRule = new rule_1.default(/^ *(.*) *% *(.*) *$/, (a, b) => a % b, 'MOD');
        const modRuleRight = new rule_1.default(/^ *(.*?) *% *(.*) *$/, (a, b) => a % b, 'MOD_RIGHT');
        const mmdDownRule = new rule_1.default(down, ident, 'MMD_DOWN');
        const mmdExpr = [
            mulRule,
            mulRuleRight,
            divRule,
            divRuleRight,
            modRule,
            modRuleRight,
            mmdDownRule,
        ];
        const expRule = new rule_1.default(/^ *(.*) *\^ *(.*) *$/, Math.pow, 'EXP');
        const expRuleRight = new rule_1.default(/^ *(.*?) *\^ *(.*) *$/, Math.pow, 'EXP_RIGHT');
        const expDownRule = new rule_1.default(down, ident, 'EXP_DOWN');
        const expExpr = [expRule, expRuleRight, expDownRule];
        const parenRule = new rule_1.default(/^ *\((.*)\) *$/, ident, 'PAREN');
        const negRule = new rule_1.default(/^ *-(.*) *$/, (a) => -a, 'NEGATIVE');
        const scalar = new rule_1.default(/^ *\d+ *$/, ident, 'SCALAR');
        const vars = new var_rule_1.default();
        const functions = new function_rule_1.default(asExpr);
        const rootExpr = [parenRule, negRule, scalar, vars, functions];
        this.populateBinaryRules(asExpr, mmdExpr, addRule, addRuleRight, subRule, subRuleRight);
        asDownRule.addChildren(1, ...mmdExpr);
        this.populateBinaryRules(mmdExpr, expExpr, mulRule, mulRuleRight, divRule, divRuleRight, modRule, modRuleRight);
        mmdDownRule.addChildren(1, ...expExpr);
        this.populateBinaryRules(rootExpr, expExpr, expRule, expRuleRight);
        expDownRule.addChildren(1, ...rootExpr);
        parenRule.addChildren(1, ...asExpr);
        negRule.addChildren(1, ...asExpr);
        this.levels = [asExpr, mmdExpr, expExpr, rootExpr];
    }
}
exports.MathGrammar = MathGrammar;
