"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractRule {
    constructor(regex, id) {
        this.allNotNaN = (arr) => {
            for (const n of arr) {
                if (isNaN(n)) {
                    return false;
                }
            }
            return true;
        };
        this.toString = () => this.id;
        this.regex = regex;
        this.id = id;
    }
}
exports.default = AbstractRule;
