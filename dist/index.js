"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.MathGrammar=void 0;const function_rule_1=__importDefault(require("./function-rule")),rule_1=__importDefault(require("./rule")),var_rule_1=__importDefault(require("./var-rule"));class MathGrammar{constructor(){this.evaluate=expr=>{for(const rule of this.levels[0]){const result=rule.evaluate(expr);if(!isNaN(result))return result}return NaN},this.populateBinaryRules=(left,right,...toPopulate)=>{toPopulate.forEach((rule=>{rule.addChildren(1,...left),rule.addChildren(2,...right)}))};const ident=a=>a,down=/^ *(.*) *$/,addRule=new rule_1.default(/^ *(.*) *\+ *(.*) *$/,((a,b)=>a+b),"ADD"),addRuleRight=new rule_1.default(/^ *(.*?) *\+ *(.*) *$/,((a,b)=>a+b),"ADD_RIGHT"),subRule=new rule_1.default(/^ *(.*) *- *(.*) *$/,((a,b)=>a-b),"SUB"),subRuleRight=new rule_1.default(/^ *(.*?) *- *(.*) *$/,((a,b)=>a-b),"SUB_RIGHT"),asDownRule=new rule_1.default(down,ident,"AS_DOWN"),asExpr=[addRule,addRuleRight,subRule,subRuleRight,asDownRule],mulRule=new rule_1.default(/^ *(.*) *\* *(.*) *$/,((a,b)=>a*b),"MULT"),mulRuleRight=new rule_1.default(/^ *(.*?) *\* *(.*) *$/,((a,b)=>a*b),"MULT_RIGHT"),divRule=new rule_1.default(/^ *(.*) *\/ *(.*) *$/,((a,b)=>a/b),"DIV"),divRuleRight=new rule_1.default(/^ *(.*?) *\/ *(.*) *$/,((a,b)=>a/b),"DIV_RIGHT"),modRule=new rule_1.default(/^ *(.*) *% *(.*) *$/,((a,b)=>a%b),"MOD"),modRuleRight=new rule_1.default(/^ *(.*?) *% *(.*) *$/,((a,b)=>a%b),"MOD_RIGHT"),mmdDownRule=new rule_1.default(down,ident,"MMD_DOWN"),mmdExpr=[mulRule,mulRuleRight,divRule,divRuleRight,modRule,modRuleRight,mmdDownRule],expRule=new rule_1.default(/^ *(.*) *\^ *(.*) *$/,Math.pow,"EXP"),expRuleRight=new rule_1.default(/^ *(.*?) *\^ *(.*) *$/,Math.pow,"EXP_RIGHT"),expDownRule=new rule_1.default(down,ident,"EXP_DOWN"),expExpr=[expRule,expRuleRight,expDownRule],parenRule=new rule_1.default(/^ *\((.*)\) *$/,ident,"PAREN"),negRule=new rule_1.default(/^ *-(.*) *$/,(a=>-a),"NEGATIVE"),rootExpr=[parenRule,negRule,new rule_1.default(/^ *\d+ *$/,ident,"SCALAR"),new var_rule_1.default,new function_rule_1.default(asExpr)];this.populateBinaryRules(asExpr,mmdExpr,addRule,addRuleRight,subRule,subRuleRight),asDownRule.addChildren(1,...mmdExpr),this.populateBinaryRules(mmdExpr,expExpr,mulRule,mulRuleRight,divRule,divRuleRight,modRule,modRuleRight),mmdDownRule.addChildren(1,...expExpr),this.populateBinaryRules(rootExpr,expExpr,expRule,expRuleRight),expDownRule.addChildren(1,...rootExpr),parenRule.addChildren(1,...asExpr),negRule.addChildren(1,...asExpr),this.levels=[asExpr,mmdExpr,expExpr,rootExpr]}}exports.MathGrammar=MathGrammar;