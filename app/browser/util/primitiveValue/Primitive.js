import { camelCase, getProtoRecursive } from "../bundle.js";
import { primitiveValue } from "./function.js";

const any = Symbol("any");
export default class Primitive {
    static get anySymbol() {
        return any;
    }

    /**
     * @param {any} val - The value of the variable.
     * @param {Array} types - an array of type to describe the val.
     * @param {boolean} valIsPrimitive - If the value is a primitive value, then this is true. (bool, string, number, bigint, symbol, function ... )
     */
    constructor(val, types, valIsPrimitive = false) {
        this.val = val;
        if (Object.isFrozen(val)) {
            types.push("frozenObject");
        }
        this.types = types;
        this.valIsPrimitive = valIsPrimitive;
    }

    isNot(...toMatchs) {
        return !this.is(...toMatchs);
    }

    isNotOr(...toMatchs) {
        return !this.isOr(...toMatchs);
    }

    isOr(...toMatchs) {
        return toMatchs.some(toMatch => this.is(Array.isArray(toMatch) ? toMatch : [toMatch]));
    }

    isPrimitive() {
        return this.valIsPrimitive;
    }

    isNotPrimitive() {
        return !this.valIsPrimitive;
    }

    isTypeOf(...toMatchs) {
        return toMatchs.some(toMatch => typeof this.val === toMatch);
    }

    isNotTypeOf(...toMatchs) {
        return !this.isTypeOf(...toMatchs);
    }

    isNotInstanceOf(...toMatchs) {
        return !this.isInstanceOf(...toMatchs);
    }

    isInstanceOf(...toMatchs) {
        try {
            return toMatchs.some(toMatch => this.val instanceof toMatch);
        } catch (e) {
            return false;
        }
    }

    /**
     * @param toMatchs - An array of values to match against.
     * @returns A boolean value.
     */
    is(...toMatchs) {
        const self = this;
        const val = self.val;
        const types = self.types;

        return toMatchs.every(toMatch => {
            let func = function(toMatch) {
                if (toMatch === any) {
                    return true;
                }
                if (!(toMatch instanceof Object && toMatch !== null && toMatch[primitiveValue.recursiveSymbol] === primitiveValue.recursiveSymbol)) {
                    if (toMatch === val || camelCase(toMatch) === val || types.includes(toMatch) || types.includes(camelCase(toMatch))) {
                        return true;
                    }

                    if (typeof toMatch === "string") {
                        if (toMatch === "primitive") {
                            return self.valIsPrimitive;
                        }
                        return self.types.includes(toMatch);
                    }
                } else {
                    toMatch = toMatch.val;
                    if (self.is("class")) {
                        return getProtoRecursive(val.prototype).some(v => {
                            if (primitiveValue(v).is(toMatch)) {
                                return true;
                            }
                        });
                    } else if (self.is("object")) {
                        return getProtoRecursive(val.constructor.prototype).some(v => {
                            if (primitiveValue(v).is(toMatch)) {
                                return true;
                            }
                        });
                    }
                }

                if (primitiveValue(toMatch).is("function") && toMatch !== Function) {
                    // test if to match is a function and not the Function constructor
                    return toMatch(val);
                }

                if (primitiveValue(toMatch).is("class")) {
                    if (primitiveValue(val).is("class")) {
                        return val === toMatch;
                    } else if (primitiveValue(val).is("object")) {
                        return val.constructor === toMatch;
                    }
                }

                if (primitiveValue(toMatch).is("object")) {
                    if (primitiveValue(val).is("class")) {
                        return val === toMatch.constructor;
                    } else if (primitiveValue(val).is("object")) {
                        return val.constructor === toMatch.constructor;
                    }
                }

                return false;
            };

            if (Array.isArray(toMatch) && toMatch !== Array) {
                return toMatch.some(v => {
                    if (v instanceof Object && v !== null && v[primitiveValue.notSymbol] === primitiveValue.notSymbol) {
                        return !func(v.val);
                    } else {
                        return func(v);
                    }
                });
            } else if (toMatch instanceof Object && toMatch !== null && toMatch[primitiveValue.notSymbol] === primitiveValue.notSymbol) {
                return !func(toMatch.val);
            } else {
                return func(toMatch);
            }
        });
    }
}
