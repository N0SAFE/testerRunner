import { Stack } from "../../../objFunction/ArrayFunction.js";
import { isProxy } from "../../../manager/proxyManager.js";
import { match, camelCase, isArrowFunc } from "../../../util/util.js";
import Primitive from "./Primitive.js";
import { bodyList } from "./globalList.js";

const PrimitiveClassMap = new Map([[Primitive, Primitive]]);

function init() {
    function createClass([className, { extendName = undefined, body }]) {
        className = camelCase(className);
        extendName = camelCase(extendName);

        console.log(className, extendName);

        let extend =
            typeof extendName === "string"
                ? PrimitiveClassMap.get(extendName)
                : undefined;

        if (!extend && typeof extendName === "string") {
            return {
                pending: {
                    isPending: true,
                    reason: "extend not defined",
                    next: () => {
                        return createClass([className, { extendName, body }]);
                    },
                },
                class: PrimitiveClassMap.get(className),
                name: className,
            };
        }

        if (PrimitiveClassMap.has(className)) {
            return {
                pending: {},
                alreadyExist: true,
                class: PrimitiveClassMap.get(className),
                extend,
                name: className,
            };
        }

        let canExtend = !!extend;

        PrimitiveClassMap.set(
            className,
            eval(
                `(class Primitive${className} ${
                    canExtend ? "extends extend" : ""
                } {${body}})`
            )
        );
        return {
            pending: {},
            class: PrimitiveClassMap.get(className),
            name: className,
            extend,
            alreadyExist: false,
        };
    }

    function createClasses(array) {
        array.forEach(function (...args) {
            let ret = createClass(...args);
            PrimitiveClassMap.set(ret.name, ret.class);
        });
    }

    createClasses([
        ["object", { body: bodyList.object(), extendName: "primitive" }],
        [
            "unknownObject",
            {
                body: bodyList.objectInstance("unknownObject"),
                extendName: "object",
            },
        ],
        [
            "class",
            {
                body: bodyList.class(),
                extendName: "primitive",
            },
        ],
        [
            "unknownClass",
            {
                body: bodyList.classInstance("unknownClass"),
                extendName: "class",
            },
        ],
        [
            "null",
            {
                body: bodyList.null_undefined("null"),
                extendName: "primitive",
            },
        ],
        [
            "undefined",
            {
                body: bodyList.null_undefined("undefined"),
                extendName: "primitive",
            },
        ],
        ["function", { body: bodyList.function(), extendName: "primitive" }],
        [
            "string",
            {
                body: bodyList.string_bool("string"),
                extendName: "primitive",
            },
        ],
        ["number", { body: bodyList.number(), extendName: "primitive" }],
        ["bigInt", { body: bodyList.bigint(), extendName: "number" }],
        [
            "boolean",
            {
                body: bodyList.string_bool(),
                extendName: "primitive",
            },
        ],

        [
            "symbol",
            {
                body: bodyList.objectInstance("symbol"),
                extendName: "object",
            },
        ],
        [
            "promise",
            {
                body: bodyList.objectInstance("promise"),
                extendName: "object",
            },
        ],
        [
            "proxy",
            {
                body: bodyList.objectInstance("proxy"),
                extendName: "object",
            },
        ],
        [
            "array",
            {
                body: bodyList.objectInstance("array"),
                extendName: "object",
            },
        ],
        [
            "date",
            {
                body: bodyList.objectInstance("date"),
                extendName: "object",
            },
        ],
        [
            "regExp",
            {
                body: bodyList.objectInstance("regExp"),
                extendName: "object",
            },
        ],
        [
            "error",
            {
                body: bodyList.objectInstance("error"),
                extendName: "object",
            },
        ],
        [
            "map",
            {
                body: bodyList.objectInstance("map"),
                extendName: "object",
            },
        ],
        [
            "set",
            {
                body: bodyList.objectInstance("set"),
                extendName: "object",
            },
        ],
        [
            "weakMap",
            {
                body: bodyList.objectInstance("weakMap"),
                extendName: "object",
            },
        ],
        [
            "weakSet",
            {
                body: bodyList.objectInstance("weakSet"),
                extendName: "object",
            },
        ],
        [
            "dataView",
            {
                body: bodyList.objectInstance("dataView"),
                extendName: "object",
            },
        ],
        [
            "int8Array",
            {
                body: bodyList.objectInstance("int8Array"),
                extendName: "object",
            },
        ],
        [
            "uint8Array",
            {
                body: bodyList.objectInstance("uint8Array"),
                extendName: "object",
            },
        ],
        [
            "uint8ClampedArray",
            {
                body: bodyList.objectInstance("uint8ClampedArray"),
                extendName: "object",
            },
        ],
        [
            "int16Array",
            {
                body: bodyList.objectInstance("int16Array"),
                extendName: "object",
            },
        ],
        [
            "uint16Array",
            {
                body: bodyList.objectInstance("uint16Array"),
                extendName: "object",
            },
        ],
        [
            "int32Array",
            {
                body: bodyList.objectInstance("int32Array"),
                extendName: "object",
            },
        ],
        [
            "uint32Array",
            {
                body: bodyList.objectInstance("uint32Array"),
                extendName: "object",
            },
        ],
        [
            "float32Array",
            {
                body: bodyList.objectInstance("float32Array"),
                extendName: "object",
            },
        ],
        [
            "float64Array",
            {
                body: bodyList.objectInstance("float64Array"),
                extendName: "object",
            },
        ],
        [
            "bigInt64Array",
            {
                body: bodyList.objectInstance("bigInt64Array"),
                extendName: "object",
            },
        ],
        [
            "bigUint64Array",
            {
                body: bodyList.objectInstance("bigUint64Array"),
                extendName: "object",
            },
        ],
        [
            "arrayBuffer",
            {
                body: bodyList.objectInstance("arrayBuffer"),
                extendName: "object",
            },
        ],
        [
            "xmlHttpRequest",
            {
                body: bodyList.objectInstance("xmlHttpRequest"),
                extendName: "object",
            },
        ],
        [
            "response",
            {
                body: bodyList.objectInstance("response"),
                extendName: "object",
            },
        ],
        [
            "request",
            {
                body: bodyList.objectInstance("request"),
                extendName: "object",
            },
        ],
    ]);

    return {
        createClass,
    };
}

function getProtoRecursive(proto) {
    if (proto !== Object.prototype) {
        return [proto, ...getExtendRecursive(Object.getPrototypeOf(proto))];
    }
}

const { createClass } = init();

PrimitiveClassMap.new = function (className, ...args) {
    className = camelCase(className);
    const Class = this.get(className);
    return new Class(...args);
};

// const DomInstanceVerif = DomList.map(function ([className]) {
//     return [
//         eval(`(${className})`),
//         function (t) {
//             return PrimitiveClassMap.new(className, t);
//         },
//     ];
// }).reverse();

const typeVerifArray = {
    instanceof: new Stack(
        [Date, (x) => PrimitiveClassMap.new("date", x)],
        [Promise, (x) => PrimitiveClassMap.new("promise", x)],
        [RegExp, (x) => PrimitiveClassMap.new("regExp", x)],
        [Error, (x) => PrimitiveClassMap.new("error", x)],
        [Map, (x) => PrimitiveClassMap.new("map", x)],
        [Set, (x) => PrimitiveClassMap.new("set", x)],
        [WeakMap, (x) => PrimitiveClassMap.new("weakMap", x)],
        [WeakSet, (x) => PrimitiveClassMap.new("weakSet", x)],
        [DataView, (x) => PrimitiveClassMap.new("dataView", x)],
        [ArrayBuffer, (x) => PrimitiveClassMap.new("arrayBuffer", x)],
        [Int8Array, (x) => PrimitiveClassMap.new("int8Array", x)],
        [Uint8Array, (x) => PrimitiveClassMap.new("uint8Array", x)],
        [
            Uint8ClampedArray,
            (x) => PrimitiveClassMap.new("uint8ClampedArray", x),
        ],
        [Int16Array, (x) => PrimitiveClassMap.new("int16Array", x)],
        [Uint16Array, (x) => PrimitiveClassMap.new("uint16Array", x)],
        [Int32Array, (x) => PrimitiveClassMap.new("int32Array", x)],
        [Uint32Array, (x) => PrimitiveClassMap.new("uint32Array", x)],
        [Float32Array, (x) => PrimitiveClassMap.new("float32Array", x)],
        [Float64Array, (x) => PrimitiveClassMap.new("float64Array", x)],
        [BigInt64Array, (x) => PrimitiveClassMap.new("bigInt64Array", x)],
        [BigUint64Array, (x) => PrimitiveClassMap.new("bigUint64Array", x)],
        [XMLHttpRequest, (x) => PrimitiveClassMap.new("xmlHttpRequest", x)],
        [Request, (x) => PrimitiveClassMap.new("request", x)],
        [Response, (x) => PrimitiveClassMap.new("response", x)]
    ),
    rest: new Stack(
        [(val) => Array.isArray(val), (x) => PrimitiveClassMap.new("array", x)],
        [(val) => val === null, (x) => PrimitiveClassMap.new("null")]
    ),
};

/**
 * determine if a variable is a class definition or function (and what kind)
 * @revised
 */
function primitiveValue(x) {
    return match(
        x,
        {
            __typeof__: {
                undefined: PrimitiveClassMap.new("undefined"),
                string: PrimitiveClassMap.new("string", x),
                number: PrimitiveClassMap.new("number", x),
                bigint: PrimitiveClassMap.new("bigInt", x),
                boolean: PrimitiveClassMap.new("boolean", x),
                symbol: PrimitiveClassMap.new("symbol", x),
                function() {
                    if (x.prototype) {
                        if (
                            Object.getOwnPropertyDescriptor(x, "prototype")
                                .writable
                        ) {
                            if (x.constructor.name === "GeneratorFunction") {
                                return PrimitiveClassMap.new(
                                    "function",
                                    x,
                                    "generator function"
                                );
                            }
                            if (
                                x.constructor.name === "AsyncGeneratorFunction"
                            ) {
                                return PrimitiveClassMap.new(
                                    "function",
                                    x,
                                    "async generator function"
                                );
                            }
                            return PrimitiveClassMap.new(
                                "function",
                                x,
                                "function"
                            );
                        }
                        if (
                            PrimitiveClassMap.has(
                                camelCase("class- " + x.constructor.name)
                            )
                        ) {
                            return PrimitiveClassMap.new(
                                camelCase("class- " + x.constructor.name),
                                x
                            );
                        }
                        return PrimitiveClassMap.new("unknownClass ", x);
                    }
                    if (x === Proxy) {
                        return PrimitiveClassMap.new("class", x);
                    }
                    if (x.constructor.name === "AsyncFunction") {
                        if (isArrowFunc(x)) {
                            return PrimitiveClassMap.new(
                                "function",
                                x,
                                "async arrow function"
                            );
                        }
                        return PrimitiveClassMap.new(
                            "function",
                            x,
                            "async function"
                        );
                    }
                    if (isProxy(x)) {
                        return PrimitiveClassMap.new("proxy", x);
                    }
                    return PrimitiveClassMap.new(
                        "function",
                        x,
                        "arrow function"
                    );
                },
            },
            __instanceof__: typeVerifArray.instanceof,
            __rest__: typeVerifArray.rest,
        },
        PrimitiveClassMap.new("unknownObject", x, typeof x)
    );
}

function addCustomBody(name, body) {
    bodyList[name] = body;
}

function getCustomBodyList() {
    return bodyList;
}

function push({
    verif,
    array,
    primitiveObjectInstanceArgs = [],
    Name,
    primitiveClassName,
    Extend,
}) {
    array.push([
        verif,
        (x) => {
            if (typeof primitiveObjectInstanceArgs === "function") {
                primitiveObjectInstanceArgs =
                    primitiveObjectInstanceArgs(x, {
                        className: primitiveClassName,
                        body,
                        extendName: primitiveExtendName,
                        extend: Extend,
                        extendArray: getExtendRecursive(Extend),
                    }) || [];
            }
            if (!Array.isArray(primitiveObjectInstanceArgs)) {
                throw new Error(
                    "primitiveObjectInstanceArgs must be an array or a function that return an array"
                );
            }
            return PrimitiveClassMap.new(
                Name,
                x,
                ...primitiveObjectInstanceArgs
            );
        },
    ]);
}

function addNewPrimitive({
    verif,
    primitiveObjectInstanceArgs,
    primitiveClassName,
    primitiveExtendName,
    body,
}) {
    if (!primitiveExtendName) {
        if (primitiveValue(verif).is("class")) {
            primitiveExtendName = verif.prototype.__proto__.constructor.name;
        } else if (primitiveValue(verif).is("object")) {
            primitiveExtendName = verif.__proto__.__proto__.constructor.name;
        } else {
            primitiveExtendName = "object";
        }
    }

    const {
        extend: Extend,
        class: Class,
        name: Name,
        alreadyExist,
        pending: {
            isPending, // is pending is true if the class is not yet defined
            reason, // reason is the reason why the class is pending
        } = {},
    } = createClass([
        primitiveClassName,
        { body, extendName: primitiveExtendName },
    ]);

    if (alreadyExist) {
        return [Name, Class];
    }

    if (isPending) {
        if (reason === "extend not defined") {
            if (primitiveValue(verif).is("class")) {
                addNewPrimitive({
                    verif: Object.getPrototypeOf(verif.prototype).constructor,
                    primitiveObjectInstanceArgs,
                    primitiveClassName: Object.getPrototypeOf(verif.prototype)
                        .constructor.name,
                    body,
                });
            } else if (primitiveValue(verif).is("object")) {
                addNewPrimitive({
                    verif: verif.__proto__.constructor,
                    primitiveObjectInstanceArgs,
                    primitiveClassName: verif.__proto__.__proto__.constructor.name,
                    body,
                });
            } else {
                throw new Error(
                    "the Primitive class cannot be created because the extend does not exist"
                );
            }
        }
    }

    if (primitiveValue(verif).is("function")) {
        push({
            verif,
            array: typeVerifArray.rest,
            primitiveObjectInstanceArgs,
            Name,
            primitiveClassName,
            Extend,
        });
    } else if (primitiveValue(verif).is("class")) {
        push({
            verif,
            array: typeVerifArray.instanceof,
            primitiveObjectInstanceArgs,
            Name,
            primitiveClassName,
            Extend,
        });
        push({
            verif: function (x) {
                return x === verif;
            },
            array: typeVerifArray.rest,
            primitiveObjectInstanceArgs,
            Name: "class- " + Name,
            primitiveClassName,
            Extend,
        });
    } else {
        push({
            verif: function (x) {
                return x === verif;
            },
            array: typeVerifArray.rest,
            primitiveObjectInstanceArgs,
            Name: "class- " + Name,
            primitiveClassName,
            Extend,
        });
    }
}

function addNewPrimitives(array) {
    let primitiveArray = array.map(function ({
        verif,
        primitiveObjectInstanceArgs = [],
        primitiveClassName,
        primitiveExtendName = "object",
        body = bodyList.objectInstance(primitiveClassName),
    }) {
        const {
            extend: Extend,
            class: Class,
            name: Name,
            alreadyExist,
        } = createClass([
            primitiveClassName,
            { body, extendName: primitiveExtendName },
        ]);

        if (alreadyExist) {
            return [Name, Class];
        }

        let arrayToPush;
        if (primitiveValue(verif).is("function")) {
            arrayToPush = typeVerifArray.rest;
        } else if (primitiveValue(verif).is("class")) {
            arrayToPush = typeVerifArray.instanceof;
        } else if (primitiveValue(verif).is("object")) {
            arrayToPush = typeVerifArray.rest;
            let lastVerif = verif;
            verif = function (toMatch) {
                toMatch === lastVerif;
            };
        } else {
            throw new Error("verif must be a function or class");
        }

        arrayToPush.push([
            verif,
            (x) => {
                if (typeof primitiveObjectInstanceArgs === "function") {
                    primitiveObjectInstanceArgs =
                        primitiveObjectInstanceArgs(x, {
                            className: primitiveClassName,
                            body,
                            extendName: primitiveExtendName,
                            extend: Extend,
                            extendArray: getExtendRecursive(Extend),
                        }) || [];
                }
                if (!Array.isArray(primitiveObjectInstanceArgs)) {
                    throw new Error(
                        "primitiveObjectInstanceArgs must be an array or a function that return an array"
                    );
                }
                return PrimitiveClassMap.new(
                    Name,
                    x,
                    ...primitiveObjectInstanceArgs
                );
            },
        ]);
        return [Name, Class];
    });
}

function getPrimitiveClassMap() {
    return PrimitiveClassMap;
}

// addNewPrimitives(
//     DomList.map(function ([className, extendName]) {
//         return {
//             verif: eval(`(${className})`),
//             className: className,
//             extendName: extendName,
//         };
//     })
// );

let start = performance.now();

const toAvoid = [Function];

console.log(
    Object.entries(Object.getOwnPropertyDescriptors(window)).reduce(
        (acc, [k, v]) => {
            acc.push(addNewPrimitive({
                verif: v.value,
                primitiveClassName: k,  
            }));
            return acc;
        },
        []
    )
);

console.log(performance.now() - start);

export {
    addCustomBody,
    addNewPrimitives,
    getPrimitiveClassMap,
    getCustomBodyList,
    primitiveValue,
    PrimitiveClassMap,
    typeVerifArray,
};
