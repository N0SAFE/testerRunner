// ! create the not.toBe function (not.toBeEqual etc...)

import { Primitive, primitiveValue } from "../../primitiveValue/_.js";
import { toStringComplexe } from "../../specialFunction.js";
import TestFail from "../../logTemplate/TestFail.js";
import { AliasExpectMethods } from "./util.js";
import { ContainerExtends } from "../../bundle.js";

import { mockFn } from "../MockFunction.js";
import * as defaultExpectMethod from "./defaultExpectMethod.js";


export class ExpectMethods {
    constructor(defaultVal, expectWrap) {
        this.defaultVal = defaultVal;
        this.expectWrap = expectWrap;

        ExpectMethods.dynamicMethods.forEach(function({ name, callback,afterVerify, verifyCallback, isNot }) {
            if (afterVerify(defaultVal)) {
                if (isNot) {
                    this.not[name] = function () {
                        if (verifyCallback(this.defaultVal, ...arguments)) {
                            return callback.apply(this, arguments);
                        } else {
                            throw new Error(`Cannot call not.${name} on ${this.defaultVal}`);
                        }
                    }
                } else {
                    this[name] = function () {
                        if (verifyCallback(this.defaultVal, ...arguments)) {
                            return callback.apply(this, arguments);
                        } else {
                            throw new Error(`Cannot call ${name} on ${this.defaultVal}`);
                        }
                    }
                }
            }
        }, this);
        
        ExpectMethods.methods.forEach(function ({ name, callback, verifyCallback, isNot }) {
            if (isNot) {
                this.not[name] = function () {
                    if (verifyCallback(this.defaultVal, ...arguments)) {
                        return callback.apply(this, arguments);
                    } else {
                        throw new Error(`Cannot call not.${name} on ${this.defaultVal}`);
                    }
                }
            } else {
                this[name] = function () {
                    if (verifyCallback(this.defaultVal, ...arguments)) {
                        return callback.apply(this, arguments);
                    } else {
                        throw new Error(`Cannot call ${name} on ${this.defaultVal}`);
                    }
                }
            }
        }, this);
    }

    toStringComplexe = toStringComplexe;

    setResult({ status, message, args, expected, functionName, error }) {
        const This = this;
        console.log(this)
        this.expectWrap.status = status;
        this.expectWrap.message = message;
        this.expectWrap.args = args;
        this.expectWrap.expected = expected;
        this.expectWrap.functionName = functionName;

        // the this.expectWrap.assets store the uuid of all the assets use in this case
        // console.trace(this.expectWrap);
        this.expectWrap.assets = {
            expected: this.expectWrap.expected,
            receive: this.expectWrap.args
        };

        // console.log(assets.getByUuid(this.expectWrap.assets.defaultVal)); // this method return the defaultVal value

        this.expectWrap.end(this.expectWrap).then(function() {
            if (status === "fail") {
                console.log("fail");
                console.error(error);
                console.error(This);
                h0xtyueiifhbc_FailTest(new TestFail(message, { assets: This.expectWrap.assets, functionName, string: error.stack.replaceAll('\\', '/').replaceAll("file:///", "")}));
                // h0xtyueiifhbc_FailTest(cycle({ name: "test fail", message, assets: This.expectWrap.assets, functionName }));
            }
        });
    }
    
    not = new class extends ContainerExtends {
        constructor(parent) {
            super(parent);
            this.setResult = parent.setResult.bind(parent);
        }
    }(this)
    
    static methods = []

    static addMethod(name, callback, verifyCallback) {
        ExpectMethods.methods.push({ name, callback, verifyCallback, isNot: false });
        return ExpectMethods;
    }

    static addNotMethod(name, callback, verifyCallback) {
        ExpectMethods.methods.push({ name, callback, verifyCallback, isNot: true });
        return ExpectMethods;
    }

    static dynamicMethods = [];

    static addMethodDynamically(name, callback,afterVerify, verifyCallback) {
        ExpectMethods.dynamicMethods.push({ name, callback,afterVerify, verifyCallback, isNot: false });
        return ExpectMethods;
    }

    static addNotMethodDynamically(name, callback, afterVerify, verifyCallback) {
        ExpectMethods.dynamicMethods.push({ name, callback,afterVerify, verifyCallback, isNot: true });
        return ExpectMethods;
    }
}


function evaluateExpectMethods(name, obj, { isNot = false, dynamic = false } = {}) {
    const verifyCallback = function (defaultVal, ...args) {
        console.log({ defaultVal, args, obj })
        console.log(obj?.expected?.arg?.type || Primitive.anySymbol)
        console.log([
            !primitiveValue(defaultVal).is(obj?.expected?.arg?.type || Primitive.anySymbol),
            obj?.received?.args?.length && obj.received.args.length !== args.length && obj.received.args.length >= 0,
            args.every((arg, index) => {
                if (obj?.received?.args[index]) {
                    primitiveValue(arg).is(obj?.received?.args[index]?.type || Primitive.anySymbol);
                }
            })
        ])
        
        if (!primitiveValue(defaultVal).is(obj?.expected?.arg?.type || Primitive.anySymbol)) {
            return false;
        }
        
        if (obj?.received?.args?.length && obj.received.args.length !== args.length && obj.received.args.length >= 0) {
            if (Array.isArray(obj.received.args.length)) { 
                // is between
                if (obj.received.args.length[0] > obj.received.args.length[1]) {
                    if (args.length < obj.received.args.length[1] || args.length > obj.received.args.length[0]) {
                        return false;
                    }
                } else {
                    if (args.length < obj.received.args.length[0] || args.length > obj.received.args.length[1]) {
                        return false;
                    }
                }
            }
            if (obj.received.args.length !== args.length && obj.received.args.length >= 0) {
                return false;
            }
            return false;
        }
        
        return args.every((arg, index) => {
            if (obj?.received?.args[index]) {
                return primitiveValue(arg).is(obj?.received?.args[index]?.type || Primitive.anySymbol);
            }
            return true;
        });
    };

    if (dynamic) {
        const afterVerify = function (defaultVal, ...args) {
            if (!primitiveValue(defaultVal).is(obj?.expected?.arg?.type || Primitive.anySymbol)) {
                return false;
            }
        }
        if (isNot) {
            return ExpectMethods.addNotMethodDynamically(name, obj.func, afterVerify, verifyCallback);
        }
        return ExpectMethods.addMethodDynamically(name, obj.func, afterVerify, verifyCallback);
    } else {
        if (isNot) {
            return ExpectMethods.addNotMethod(name, obj.func, verifyCallback);
        }
        return ExpectMethods.addMethod(name, obj.func, verifyCallback);
    }
}

function parseObjectAdditionalExpectFunctions(obj) {
    Object.entries(obj).forEach(function([key, value]) {
        if (key === "not") {
            return true;
        }
        // console.log(value)
        // console.log(key)
        // console.log(obj)
        if (value instanceof AliasExpectMethods) {
            value = obj[value.name]
        }
        if (value.dynamic) {
            evaluateExpectMethods(key, value, { isNot: false, dynamic: true });
        } else {
            evaluateExpectMethods(key, value, { isNot: false, dynamic: false });
        }
    });
    
    Object.entries(obj.not).forEach(function ([key, value]) {
        if (value instanceof AliasExpectMethods) {
            value = obj.not[value.name]
        }
        if (value.dynamic) {
            evaluateExpectMethods(key, value, { isNot: true, dynamic: true });
        } else {
            evaluateExpectMethods(key, value, { isNot: true, dynamic: false });
        }
    });
}

parseObjectAdditionalExpectFunctions(defaultExpectMethod.additionalExpectFunctions);
parseObjectAdditionalExpectFunctions(mockFn.additionalExpectFunctions)