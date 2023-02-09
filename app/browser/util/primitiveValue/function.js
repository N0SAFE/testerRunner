import { isProxy, camelCase, isArrowFunc, match } from "../bundle.js";
import Primitive from "./Primitive.js";

class Module {}

window.Module = Module;

const newPrimitive = function(...args) {
    // console.trace(...args);
    return new Primitive(...args);
};

/**
 * It returns an object with a `value` property that is the original value, and a `type` property that
 * is an array of strings that describe the type of the value
 * @param x - The value to be wrapped by the Primitive Class.
 * @returns {Primitive} a Primitive object
 */
export function primitiveValue(x, options = {}) {
    let get;
    if (typeof options.customGet === "function") {
        get = options.customGet;
    } else {
        get = function(object, prop) {
            return object[prop];
        };
    }

    if (typeof x === "object" && x !== null && !(x instanceof Object) && x[Symbol.toStringTag] === "Module") {
        return newPrimitive(x, ["object", Object, "module", Module], true);
    }

    return match(
        x,
        {
            [match.typeof]: {
                undefined: x => newPrimitive(x, ["undefined", undefined], true),
                string: x => newPrimitive(x, ["string", String], true),
                number: x => newPrimitive(x, ["number", Number], true),
                bigint: x => newPrimitive(x, ["bigint", BigInt], true),
                boolean: x => newPrimitive(x, ["boolean", Boolean], true),
                symbol: x => newPrimitive(x, ["symbol", Symbol], true),
                function(x) {
                    if (get(x, "prototype")) {
                        if (Object.getOwnPropertyDescriptor(x, "prototype").writable) {
                            if (x.constructor.name === "GeneratorFunction") {
                                return newPrimitive(x, ["function", "sync generator function", "sync function", "generator function", Function], true);
                            }
                            if (x.constructor.name === "AsyncGeneratorFunction") {
                                return newPrimitive(x, ["function", "async generator function", "async function", "generator function", Function], true);
                            }
                            return newPrimitive(x, ["function", "sync function", Function], true);
                        }
                        return newPrimitive(x, ["class", camelCase(get(x, "name")), x, `class ${camelCase(get(x, "name"))}`], false);
                    }
                    if (x === Proxy) {
                        return newPrimitive(x, ["class", Proxy, "Proxy", "class Proxy"], false);
                    }
                    if (get(get(x, "constructor"), "name") === "AsyncFunction") {
                        if (isArrowFunc(x)) {
                            return newPrimitive(x, ["function", "async arrow function", "async function", "arrow function", Function], true);
                        }
                        return newPrimitive(x, ["function", "async function", Function], true);
                    }
                    return newPrimitive(x, ["function", "sync arrow function", "sync function", "arrow function", Function], true);
                }
            },
            [match.rest]: [
                [x => x === null, () => newPrimitive(null, ["null", null], true)],
                [x => isProxy(x), x => newPrimitive(x, ["object", "Proxy", Proxy, "object Proxy"], false)],
                [x => Array.isArray(x), x => newPrimitive(x, ["array", Array, "object Array"], false)]
            ]
        },
        x => newPrimitive(x, ["object", camelCase(get(get(x, "constructor"), "name")), get(x, "constructor"), `object ${camelCase(get(get(x, "constructor"), "name"))}`], false)
    );
}

/* A function that returns an object with a property that is a symbol. */
primitiveValue.recursive = function(val) {
    return {
        [primitiveValue.recursiveSymbol]: primitiveValue.recursiveSymbol,
        val
    };
};

primitiveValue.not = function(val) {
    return {
        [primitiveValue.notSymbol]: primitiveValue.notSymbol,
        val
    };
};

primitiveValue.notSymbol = Symbol("not");

/* A symbol that is used to check if a value is recursive. */
primitiveValue.recursiveSymbol = Symbol("isRecursive");
