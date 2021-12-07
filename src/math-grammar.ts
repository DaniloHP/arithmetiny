import Rule from './rule'
import BinaryRule from './binary-rule'
import UnaryRule from './unary-rule'

export default class MathGrammar {
  private readonly levels: Rule[][]

  constructor() {
    const ident = (a: number) => a
    const down = /^ *(.*) *$/
    const addRule = new BinaryRule(
      /^ *(.*) *\+ *(.*) *$/,
      (a, b) => a + b,
      'ADD',
    )
    const addRuleRight = new BinaryRule(
      /^ *(.*?) *\+ *(.*) *$/,
      (a, b) => a + b,
      'ADD_RIGHT',
    )
    const subRule = new BinaryRule(
      /^ *(.*) *- *(.*) *$/,
      (a, b) => a - b,
      'SUB',
    )
    const subRuleRight = new BinaryRule(
      /^ *(.*?) *- *(.*) *$/,
      (a, b) => a - b,
      'SUB_RIGHT',
    )
    const asDownRule = new UnaryRule(down, ident, 'AS_DOWN')
    const asExpr = [addRule, addRuleRight, subRule, subRuleRight, asDownRule]

    const mulRule = new BinaryRule(
      /^ *(.*) *\* *(.*) *$/,
      (a, b) => a * b,
      'MULT',
    )
    const mulRuleRight = new BinaryRule(
      /^ *(.*?) *\* *(.*) *$/,
      (a, b) => a * b,
      'MULT_RIGHT',
    )
    const divRule = new BinaryRule(
      /^ *(.*) *\/ *(.*) *$/,
      (a, b) => a / b,
      'DIV',
    )
    const divRuleRight = new BinaryRule(
      /^ *(.*?) *\/ *(.*) *$/,
      (a, b) => a / b,
      'DIV_RIGHT',
    )
    const modRule = new BinaryRule(
      /^ *(.*) *% *(.*) *$/,
      (a, b) => a % b,
      'MOD',
    )
    const modRuleRight = new BinaryRule(
      /^ *(.*?) *% *(.*) *$/,
      (a, b) => a % b,
      'MOD_RIGHT',
    )
    const mmdDownRule = new UnaryRule(down, ident, 'MMD_DOWN')
    const mmdExpr = [
      mulRule,
      mulRuleRight,
      divRule,
      divRuleRight,
      modRule,
      modRuleRight,
      mmdDownRule,
    ]

    const expRule = new BinaryRule(/^ *(.*) *\^ *(.*) *$/, Math.pow, 'EXP')
    const expRuleRight = new BinaryRule(
      /^ *(.*?) *\^ *(.*) *$/,
      Math.pow,
      'EXP_RIGHT',
    )
    const expDownRule = new UnaryRule(down, ident, 'EXP_DOWN')
    const expExpr = [expRule, expRuleRight, expDownRule]

    const parenRule = new UnaryRule(/^ *\((.*)\) *$/, ident, 'PAREN')
    const negRule = new UnaryRule(/^ *-(.*) *$/, (a) => -a, 'NEGATIVE')
    const scalar = new UnaryRule(/^ *\d+ *$/, ident, 'SCALAR')
    const rootExpr = [parenRule, negRule, scalar]

    this.populateBinaryRules(
      asExpr,
      mmdExpr,
      addRule,
      addRuleRight,
      subRule,
      subRuleRight,
    )
    asDownRule.addChildren(1, ...mmdExpr)
    this.populateBinaryRules(
      mmdExpr,
      expExpr,
      mulRule,
      mulRuleRight,
      divRule,
      divRuleRight,
      modRule,
      modRuleRight,
    )
    mmdDownRule.addChildren(1, ...expExpr)
    this.populateBinaryRules(rootExpr, expExpr, expRule, expRuleRight)
    expDownRule.addChildren(1, ...rootExpr)
    parenRule.addChildren(1, ...asExpr)
    negRule.addChildren(1, ...asExpr)
    this.levels = [asExpr, mmdExpr, expExpr, rootExpr]
  }

  public evaluate = (expr: string): number => {
    for (const rule of this.levels[0]) {
      const result = rule.evaluate(expr)
      if (!isNaN(result)) {
        return result
      }
    }
    return NaN
  }

  populateBinaryRules = (
    left: Rule[],
    right: Rule[],
    ...toPopulate: Rule[]
  ) => {
    toPopulate.forEach((rule) => {
      rule.addChildren(1, ...left)
      rule.addChildren(2, ...right)
    })
  }
}
