import { AliasExpectMethods } from "./util.js";
import { primitiveValue } from "../../primitiveValue/_.js";
import { cycle, uncycle, isFunction, isAsyncFunction, uuidv5, deepEqual } from "../../bundle.js";

const expectFunction = {
    toBe: {
        received: {
            args: {
                length: 1
            }
        },
        func(value) {
            if (this.defaultVal === value) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] to be [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "toBe"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] to be [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "toBe",
                    error: new Error("to be")
                });
            }
            return this;
        }
    },
    toBeEqual: {
        received: {
            args: {
                length: 1
            }
        },
        func(value) {
            if (deepEqual(this.defaultVal, value)) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] to be equal to [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "toBeEqual"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] to be equal to [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "toBeEqual",
                    error: new Error("to be equal")
                });
            }
        }
    },
    toEqual: new AliasExpectMethods("toBeEqual"),
    toBeNull: {
        received: {
            args: {
                length: 0
            }
        },
        func() {
            if (this.defaultVal === null) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] to be null`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "toBeNull"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] to be null`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "toBeNull",
                    error: new Error("to be null")
                });
            }
            return this;
        }
    },
    toBeUndefined: {
        received: {
            args: {
                length: 0
            }
        },
        func() {
            if (this.defaultVal === undefined) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] to be undefined`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "toBeUndefined"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] to be undefined`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "toBeUndefined",
                    error: new Error("to be undefined")
                });
            }
            return this;
        }
    },
    toBeDefined: {
        received: {
            args: {
                length: 0
            }
        },
        func() {
            if (this.defaultVal !== undefined) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] to be defined`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "toBeDefined"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] to be defined`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "toBeDefined",
                    error: new Error("to be defined")
                });
            }
            return this;
        }
    },
    toBeNaN: {
        received: {
            args: {
                length: 0
            }
        },
        func() {
            if (isNaN(this.defaultVal)) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] to be NaN`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "toBeNaN"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] to be NaN`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "toBeNaN",
                    error: new Error("to be NaN")
                });
            }
            return this;
        }
    },
    toBeTruthy: {
        received: {
            args: {
                length: 0
            }
        },
        func() {
            if (this.defaultVal) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] to be truthy`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "toBeTruthy"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] to be truthy`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "toBeTruthy",
                    error: new Error("to be truthy")
                });
            }
            return this;
        }
    },
    toBeFalsy: {
        received: {
            args: {
                length: 0
            }
        },
        func() {
            if (!this.defaultVal) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] to be falsy`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "toBeFalsy"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] to be falsy`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "toBeFalsy",
                    error: new Error("to be falsy")
                });
            }
            return this;
        }
    },
    toBeTrue: {
        received: {
            args: {
                length: 0
            }
        },
        func() {
            if (this.defaultVal === true) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] to be true`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "toBeTrue"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] to be true`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "toBeTrue",
                    error: new Error("to be true")
                });
            }
            return this;
        }
    },
    toBeFalse: {
        received: {
            args: {
                length: 0
            }
        },
        func() {
            if (this.defaultVal === false) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] to be false`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "toBeFalse"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] to be false`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "toBeFalse",
                    error: new Error("to be false")
                });
            }
            return this;
        }
    },
    toBeGreaterThan: {
        received: {
            args: {
                length: 1,
                0: {
                    type: "number"
                }
            }
        },
        func(value) {
            if (this.defaultVal > value) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] to be greater than [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "toBeGreaterThan"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] to be greater than [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "toBeGreaterThan",
                    error: new Error(`to be greater than ${value}`)
                });
            }
            return this;
        }
    },
    toBeGreaterThanOrEqual: {
        received: {
            args: {
                length: 1,
                0: {
                    type: "number"
                }
            }
        },
        func(value) {
            if (this.defaultVal >= value) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] to be greater than or equal to [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "toBeGreaterThanOrEqual"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] to be greater than or equal to [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "toBeGreaterThanOrEqual",
                    error: new Error(`to be greater than or equal to ${value}`)
                });
            }
            return this;
        }
    },
    toBeLessThan: {
        received: {
            args: {
                length: 1,
                0: {
                    type: "number"
                }
            }
        },
        func(value) {
            if (this.defaultVal < value) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] to be less than [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "toBeLessThan"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] to be less than [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "toBeLessThan",
                    error: new Error(`to be less than ${value}`)
                });
            }
            return this;
        }
    },
    toBeLessThanOrEqual: {
        received: {
            args: {
                length: 1,
                0: {
                    type: "number"
                }
            }
        },
        func(value) {
            if (this.defaultVal <= value) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] to be less than or equal to [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "toBeLessThanOrEqual"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] to be less than or equal to [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "toBeLessThanOrEqual",
                    error: new Error(`to be less than or equal to ${value}`)
                });
            }
            return this;
        }
    },
    toBeCloseTo: {
        received: {
            args: {
                length: [1, 2],
                0: {
                    type: "number"
                },
                1: {
                    type: ["number", undefined]
                }
            }
        },
        func(value, precision = 2) {
            if (Math.abs(value - this.defaultVal) < Math.pow(10, -precision) / 2) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] to be close to [{assets.args[0]}]`,
                    args: [value, precision],
                    expected: this.defaultVal,
                    functionName: "toBeCloseTo"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] to be close to [{assets.args[0]}]`,
                    args: [value, precision],
                    expected: this.defaultVal,
                    functionName: "toBeCloseTo",
                    error: new Error(`to be close to ${value}`)
                });
            }
            return this;
        }
    },
    toContain: {
        expected: {
            arg: {
                type: "array"
            }
        },
        received: {
            args: {
                length: 1
            }
        },
        func(value) {
            if (this.defaultVal.includes(value)) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] to contain [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "toContain"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] to contain [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "toContain",
                    error: new Error(`to contain ${value}`)
                });
            }
            return this;
        }
    },
    toBePrimitiveOf: {
        received: {
            args: {
                length: 1
            }
        },
        func: function(primitiveVal) {
            if (primitiveValue(this.defaultVal).is(primitiveVal)) {
                this.setResult({
                    status: "pass",
                    expected: this.defaultVal,
                    message: `Expected [{assets.stringDefaultVal}] to match primtiveValue [{assets.args[0]}]`,
                    args: [primitiveVal],
                    functionName: "toBePrimitiveOf"
                });
            } else {
                this.setResult({
                    status: "fail",
                    expected: this.defaultVal,
                    message: `Expected [{assets.stringDefaultVal}] to match primtiveValue [{assets.args[0]}]`,
                    args: [primitiveVal],
                    functionName: "toBePrimitiveOf",
                    error: new Error("to be primitive of")
                });
            }
            return this;
        }
    },
    any: new AliasExpectMethods("toBePrimitiveOf"),
    toVerifyFunction: {
        received: {
            args: {
                length: 1,
                type: "function"
            }
        },
        func(callback) {
            const This = this;
            let response = callback(this.defaultVal);
            if (response instanceof Promise) {
                response.then(function(res) {
                    This.setResult({
                        status: res ? "pass" : "fail",
                        message: `Expected [{assets.stringDefaultVal}] to verify function [{assets.args[0]}]`,
                        args: [callback.toString()],
                        expected: this.defaultVal,
                        functionName: "toVerifyFunction",
                        ...(res ? {} : { error: new Error("to verify function") })
                    });
                });
            } else {
                this.setResult({
                    status: response ? "pass" : "fail",
                    message: `Expected [{assets.stringDefaultVal}] to verify function [{assets.args[0]}]`,
                    args: [callback.toString()],
                    expected: this.defaultVal,
                    functionName: "toVerifyFunction",
                    ...(response ? {} : { error: new Error("to verify function") })
                });
            }
            return response;
        }
    },
    toHaveProperties: {
        received: {
            args: {
                length: 1,
                type: ["array", "string", "number", "symbol"]
            }
        },
        func(prop, { Own = false } = {}) {
            if (Array.isArray(prop)) {
                for (let i = 0; i < prop.length; i++) {
                    if (!["string", "number", "symbol"].includes(typeof prop[i])) {
                        throw new Error("prop must be a string|number|symbol or an array of string|number|symbol");
                    }
                    let result;
                    if (Own) {
                        result = this.defaultVal.hasOwnProperty(prop[i]) ? true : false;
                    } else {
                        result = this.defaultVal[prop[i]] !== undefined;
                    }
                    if (!result) {
                        this.setResult({
                            status: "fail",
                            message: `expected [{assets.stringDefaultVal}] to have property [{assets.args[0]}]`,
                            args: [prop[i]],
                            expected: this.defaultVal,
                            functionName: "toHaveProperties",
                            error: new Error("to have properties")
                        });
                        return this;
                    }
                }
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] to have property [{assets.args[0]}]`,
                    args: [prop],
                    expected: this.defaultVal,
                    functionName: "toHaveProperties"
                });
                return this;
            }
            if (!["string", "number", "symbol"].includes(typeof prop)) {
                throw new Error("prop must be a string|number|symbol or an array of string|number|symbol");
            }
            let result;
            if (Own) {
                result = this.defaultVal.hasOwnProperty(prop) ? true : false;
            } else {
                result = this.defaultVal[prop] !== undefined;
            }
            if (!result) {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] to have property [{assets.args[0]}]`,
                    args: [prop],
                    expected: this.defaultVal,
                    functionName: "toHaveProperties",
                    error: new Error("to have properties")
                });
                return this;
            }
            this.setResult({
                status: "success",
                message: `expected [{assets.stringDefaultVal}] to have property [{assets.args[0]}]`,
                args: [prop],
                expected: this.defaultVal,
                functionName: "toHaveProperties"
            });
            return this;
        }
    },
    toBeImportable: {
        expected: {
            arg: {
                type: "string"
            }
        },
        func() {
            const prom = new Promise(async (res, rej) => {
                try {
                    try {
                        new URL(this.defaultVal);
                    } catch (e) {
                        this.defaultVal = new URL(window.h0xtyueiifhbc + "/../" + this.defaultVal).href;
                    }
                    let module = await import(this.defaultVal);
                    this.setResult({
                        status: "success",
                        message: `expected [{assets.stringDefaultVal}] to be importable`,
                        args: [],
                        expected: this.defaultVal,
                        functionName: "toBeImportable"
                    });
                    res({ this: this, module });
                } catch (e) {
                    this.setResult({
                        status: "fail",
                        message: `expected [{assets.stringDefaultVal}] to be importable`,
                        args: [],
                        expected: this.defaultVal,
                        functionName: "toBeImportable",
                        error: e
                    });
                    console.error(e);
                    res({ this: this, module: false, error: e });
                }
            });
            const This = this;
            prom.toThrow = function() {
                const ret = prom.then(function(obj) {
                    if (This.expectWrap.status === "fail") {
                        This.expectWrap.parent.throwWrap(obj.error);
                        throw obj.error;
                    }
                    return obj;
                });
                ret.module = ret.then(res => res.module);
                return ret;
            };
            prom.toBool = function() {
                return prom.then(function() {
                    return This.expectWrap.status !== "fail";
                });
            };
            prom.module = prom.then(res => res.module);
            return prom;
        }
    },
    toThrow: {
        expected: {
            arg: {
                type: "function"
            }
        },
        func(...args) {
            try {
                this.defaultVal(...args);
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] to throw`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "toThrow",
                    error: new Error("to throw")
                });
            } catch (e) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] to throw`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "toThrow"
                });
            }
            return this;
        }
    },
    toThrowError: new AliasExpectMethods("toThrow")
};

/**
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */

const notExpectFunction = {
    toBe: {
        received: {
            args: {
                length: 1
            }
        },
        func(value) {
            if (this.defaultVal !== value) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] not to be [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "notToBe"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] not to be [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "notToBe",
                    error: new Error("not to be")
                });
            }
            return this;
        }
    },
    toBeEqual: {
        received: {
            args: {
                length: 1
            }
        },
        func(value) {
            if (!deepEqual(this.defaultVal, value)) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] not to be equal [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "notToBeEqual"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] not to be equal [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "notToBeEqual",
                    error: new Error("not to be equal")
                });
            }
            return this;
        }
    },
    toEqual: new AliasExpectMethods("toBeEqual"),
    toBeNull: {
        received: {
            args: {
                length: 0
            }
        },
        func() {
            if (this.defaultVal !== null) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] not to be null`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "notToBeNull"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] not to be null`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "notToBeNull",
                    error: new Error("not to be null")
                });
            }
            return this;
        }
    },
    toBeUndefined: {
        received: {
            args: {
                length: 0
            }
        },
        func() {
            if (this.defaultVal !== undefined) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] not to be undefined`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "notToBeUndefined"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] not to be undefined`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "notToBeUndefined",
                    error: new Error("not to be undefined")
                });
            }
            return this;
        }
    },
    toBeDefined: {
        received: {
            args: {
                length: 0
            }
        },
        func() {
            if (this.defaultVal === undefined) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] not to be defined`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "notToBeDefined"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] not to be defined`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "notToBeDefined",
                    error: new Error("not to be defined")
                });
            }
            return this;
        }
    },
    toBeNaN: {
        received: {
            args: {
                length: 0
            }
        },
        func() {
            if (!isNaN(this.defaultVal)) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] not to be NaN`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "notToBeNaN"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] not to be NaN`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "notToBeNaN",
                    error: new Error("not to be NaN")
                });
            }
            return this;
        }
    },
    toBeTruthy: {
        received: {
            args: {
                length: 0
            }
        },
        func() {
            if (!this.defaultVal) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] not to be truthy`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "notToBeTruthy"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] not to be truthy`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "notToBeTruthy",
                    error: new Error("not to be truthy")
                });
            }
            return this;
        }
    },
    toBeFalsy: {
        received: {
            args: {
                length: 0
            }
        },
        func() {
            if (this.defaultVal) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] not to be falsy`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "notToBeFalsy"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] not to be falsy`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "notToBeFalsy",
                    error: new Error("not to be falsy")
                });
            }
            return this;
        }
    },
    toBeTrue: {
        received: {
            args: {
                length: 0
            }
        },
        func() {
            if (this.defaultVal !== true) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] not to be true`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "notToBeTrue"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] not to be true`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "notToBeTrue",
                    error: new Error("not to be true")
                });
            }
            return this;
        }
    },
    toBeFalse: {
        received: {
            args: {
                length: 0
            }
        },
        func() {
            if (this.defaultVal !== false) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] not to be false`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "notToBeFalse"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] not to be false`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "notToBeFalse",
                    error: new Error("not to be false")
                });
            }
            return this;
        }
    },
    toBeGreaterThan: {
        received: {
            args: {
                length: 1,
                0: {
                    type: "number"
                }
            }
        },
        func(value) {
            if (!(this.defaultVal > value)) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] not to be greater than [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "notToBeGreaterThan"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] not to be greater than [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "notToBeGreaterThan",
                    error: new Error("not to be greater than")
                });
            }
            return this;
        }
    },
    toBeGreaterThanOrEqual: {
        received: {
            args: {
                length: 1,
                0: {
                    type: "number"
                }
            }
        },
        func(value) {
            if (!(this.defaultVal >= value)) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] not to be greater than or equal to [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "notToBeGreaterThanOrEqual"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] not to be greater than or equal to [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "notToBeGreaterThanOrEqual",
                    error: new Error("not to be greater than or equal to")
                });
            }
            return this;
        }
    },
    toBeLessThan: {
        received: {
            args: {
                length: 1,
                0: {
                    type: "number"
                }
            }
        },
        func(value) {
            if (!(this.defaultVal < value)) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] not to be less than [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "notToBeLessThan"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] not to be less than [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "notToBeLessThan",
                    error: new Error("not to be less than")
                });
            }
            return this;
        }
    },
    toBeLessThanOrEqual: {
        received: {
            args: {
                length: 1,
                0: {
                    type: "number"
                }
            }
        },
        func(value) {
            if (!(this.defaultVal <= value)) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] not to be less than or equal to [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "notToBeLessThanOrEqual"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] not to be less than or equal to [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "notToBeLessThanOrEqual",
                    error: new Error("not to be less than or equal to")
                });
            }
            return this;
        }
    },
    toBeCloseTo: {
        received: {
            args: {
                length: 2,
                0: {
                    type: "number"
                },
                1: {
                    type: ["number", undefined]
                }
            }
        },
        func(value, precision) {
            if (!(Math.abs(value - this.defaultVal) < Math.pow(10, -precision) / 2)) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] not to be close to [{assets.args[0]}]`,
                    args: [value, precision],
                    expected: this.defaultVal,
                    functionName: "notToBeCloseTo"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] not to be close to [{assets.args[0]}]`,
                    args: [value, precision],
                    expected: this.defaultVal,
                    functionName: "notToBeCloseTo",
                    error: new Error("not to be close to")
                });
            }
            return this;
        }
    },
    toContain: {
        expected: {
            arg: {
                type: "array"
            }
        },
        received: {
            args: {
                length: 1
            }
        },
        func(value) {
            if (!this.defaultVal.includes(value)) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] not to contain [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "notToContain"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] not to contain [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "notToContain",
                    error: new Error("not to contain")
                });
            }
            return this;
        }
    },
    toBePrimitiveOf: {
        received: {
            args: {
                length: 1
            }
        },
        func(value) {
            if (primitiveValue(this.parent.defaultVal).isNot(value)) {
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] not to be primitive of [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "notToBePrimitiveOf"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] not to be primitive of [{assets.args[0]}]`,
                    args: [value],
                    expected: this.defaultVal,
                    functionName: "notToBePrimitiveOf",
                    error: new Error("not to be primitive of")
                });
            }
        }
    },
    any: new AliasExpectMethods("toBePrimitiveOf"),
    toVerifyFunction: {
        received: {
            args: {
                length: 1,
                type: "function"
            }
        },
        func(callback) {
            const This = this;
            let response = callback(this.defaultVal);
            if (response instanceof Promise) {
                response.then(function(res) {
                    This.setResult({
                        status: !res ? "pass" : "fail",
                        message: `Expected [{assets.stringDefaultVal}] not to verify function [{assets.args[0]}]`,
                        args: [callback.toString()],
                        expected: this.defaultVal,
                        functionName: "notToVerifyFunction",
                        ...(!res ? {} : { error: new Error("to verify function") })
                    });
                });
            } else {
                this.setResult({
                    status: !response ? "pass" : "fail",
                    message: `Expected [{assets.stringDefaultVal}] not to verify function [{assets.args[0]}]`,
                    args: [callback.toString()],
                    expected: this.defaultVal,
                    functionName: "notToVerifyFunction",
                    ...(!response ? {} : { error: new Error("to verify function") })
                });
            }
            return response;
        }
    },
    toHaveProperties: {
        received: {
            args: {
                length: 1,
                type: ["array", "string", "number", "symbol"]
            }
        },
        func(prop, { Own = false } = {}) {
            if (Array.isArray(prop)) {
                console.log("prop", prop);
                for (let i = 0; i < prop.length; i++) {
                    if (!["string", "number", "symbol"].includes(typeof prop[i])) {
                        throw new Error("prop must be a string|number|symbol or an array of string|number|symbol");
                    }
                    let result;
                    console.log(this);
                    console.log(this.defaultVal);
                    if (Own) {
                        result = this.defaultVal.hasOwnProperty(prop[i]) ? true : false;
                    } else {
                        result = this.defaultVal[prop[i]] !== undefined;
                    }
                    console.log(result);
                    if (result) {
                        this.setResult({
                            status: "fail",
                            message: `expected [{assets.stringDefaultVal}] not to have property [{assets.args[0]}]`,
                            args: [prop[i]],
                            expected: this.defaultVal,
                            functionName: "notToHaveProperties",
                            error: new Error("not to have property")
                        });
                        return this;
                    }
                }
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] not to have property [{assets.args[0]}]`,
                    args: [prop],
                    expected: this.defaultVal,
                    functionName: "notToHaveProperties"
                });
                return this;
            }
            if (!["string", "number", "symbol"].includes(typeof prop)) {
                throw new Error("prop must be a string|number|symbol or an array of string|number|symbol");
            }
            let result;
            if (Own) {
                result = this.defaultVal.hasOwnProperty(prop) ? true : false;
            } else {
                result = this.defaultVal[prop] !== undefined;
            }
            if (result) {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] not to have property [{assets.args[0]}]`,
                    args: [prop],
                    expected: this.defaultVal,
                    functionName: "notToHaveProperties",
                    error: new Error("not to have property")
                });
                return this;
            }
            this.setResult({
                status: "success",
                message: `expected [{assets.stringDefaultVal}] not to have property [{assets.args[0]}]`,
                args: [prop],
                expected: this.defaultVal,
                functionName: "notToHaveProperties"
            });
            return this;
        }
    },
    toBeImportable: {
        expected: {
            arg: {
                type: "string"
            }
        },
        func() {
            const prom = new Promise(async (res, rej) => {
                try {
                    try {
                        new URL(this.defaultVal);
                    } catch (e) {
                        this.defaultVal = new URL(window.h0xtyueiifhbc + "/../" + this.defaultVal).href;
                    }
                    let module = await import(this.defaultVal);
                    this.setResult({
                        status: "fail",
                        message: `expected [{assets.stringDefaultVal}] not to be importable`,
                        args: [],
                        expected: this.defaultVal,
                        functionName: "notToBeImportable",
                        error: new Error("not to be importable")
                    });
                    res({ this: this, module });
                } catch (e) {
                    this.setResult({
                        status: "success",
                        message: `expected [{assets.stringDefaultVal}] not to be importable`,
                        args: [],
                        expected: this.defaultVal,
                        functionName: "notToBeImportable"
                    });
                    console.error(e);
                    res({ this: this, module: false, error: e });
                }
            });
            const This = this;
            prom.toThrow = function() {
                const ret = prom.then(function(obj) {
                    if (This.expectWrap.status === "fail") {
                        This.expectWrap.parent.throwWrap(new Error("the module is importable"));
                        throw obj.error;
                    }
                    return obj;
                });
                ret.module = ret.then(res => res.module);
                return ret;
            };
            prom.toBool = function() {
                return prom.then(function() {
                    return This.expectWrap.status !== "fail";
                });
            };
            prom.module = prom.then(res => res.module);
            return prom;
        }
    },
    toThrow: {
        expected: {
            arg: {
                type: "function"
            }
        },
        func() {
            try {
                this.defaultVal();
                this.setResult({
                    status: "success",
                    message: `expected [{assets.stringDefaultVal}] not to throw`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "notToThrow"
                });
            } catch (e) {
                this.setResult({
                    status: "fail",
                    message: `expected [{assets.stringDefaultVal}] not to throw`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "notToThrow",
                    error: e
                });
            }
            return this;
        }
    },
    toThrowError: new AliasExpectMethods("toThrow")
};

export const additionalExpectFunctions = {
    ...expectFunction,
    not: notExpectFunction
};
