class notFoundsSearchInObject {}

/**
 * It takes an object, an array of keys, and a value, and adds the value to the object at the location
 * specified by the array of keys.
 * @returns The value of the last key in the suit array.
 */
const addInObject = function() {
    if (arguments.length < 3) throw new Error("must be called with 3 arguments but " + arguments.length + " found");
    let OBJECT = arguments[0];
    let suit = arguments[1];
    let value = arguments[2];
    let options = arguments[3];

    // verify if suit is an array
    if (!Array.isArray(suit)) {
        throw new Error("suit must be of type array");
    }

    options = options instanceof Object ? options : {};

    function recFunc(OBJECT, suit, value) {
        if (typeof suit[0] === "string" && suit[0].search("\\.")) {
            suit = [...suit[0].split("."), ...suit.splice(1, suit.length - 1)];
        }
        if (suit.length > 1) {
            let val;
            if (typeof options.customGet === "function") {
                val = options.customGet(OBJECT, suit[0]);
            } else {
                val = OBJECT[suit[0]];
            }
            if (!val || typeof val !== "object") {
                if (Array.isArray(suit[1]) && !Array.isArray(val)) {
                    if (typeof options.customGet === "function") {
                        OBJECT[suit[0]] = options.customSet(OBJECT, suit[0], []);
                    } else {
                        OBJECT[suit[0]] = [];
                    }
                } else {
                    if (Array.isArray(suit[0]) && suit[0].length == 0) {
                        let obj;
                        if (Array.isArray(suit[1]) && !Array.isArray(val)) {
                            obj = [];
                        } else {
                            obj = {};
                        }
                        OBJECT.push(obj);
                        recFunc(obj, suit.slice(1), value);
                        return;
                    }
                    if (typeof options.customSet === "function") {
                        OBJECT[suit[0]] = options.customSet(OBJECT, suit[0], []);
                    } else {
                        OBJECT[suit[0]] = {};
                    }
                }
            }
            if (typeof options.customGet === "function") {
                recFunc(options.customGet(OBJECT, suit[0]), suit.slice(1), value);
            } else {
                recFunc(OBJECT[suit[0]], suit.slice(1), value);
            }
        } else {
            if (Array.isArray(suit[0]) && suit[0].length == 0) {
                OBJECT.push(value);
            } else {
                if (typeof options.customSet === "function") {
                    // console.log(value)
                    // console.log(OBJECT)
                    OBJECT[suit[0]] = options.customSet(OBJECT, suit[0], value);
                } else {
                    OBJECT[suit[0]] = value;
                }
            }
        }
    }
    recFunc(OBJECT, Array.from(suit), value);

    if (typeof options.customGet === "function") {
        return suit.length > 0 ? options.customGet(OBJECT, suit[0]) : OBJECT;
    }

    return suit.length > 0 ? OBJECT[suit[0]] : OBJECT;
};

/**
 * It takes an object and an array of keys and returns the value of the object at the end of the key
 * chain.
 * @returns The value of the key in the object.
 */
function searchInObject() {
    if (arguments.length < 2) throw new Error("must be called with 2 arguments but " + arguments.length + " found");
    let OBJECT = arguments[0];
    let suit = arguments[1];
    let options = arguments[2] instanceof Object ? arguments[2] : {};

    // verify if suit is an array
    if (!Array.isArray(suit)) {
        throw new Error("suit must be of type array");
    }

    let globalSuit = suit;

    let recFunc = (OBJECT, suit) => {
        if (suit.length > 0) {
            let search = suit.shift();
            if (typeof search !== "string" && typeof search !== "number" && typeof search !== "symbol") {
                console.error(globalSuit);
                throw new Error("the suit as to be an array of string and a " + typeof search + " as be find in it");
            }
            if (typeof search === "string" && search.search("\\.") != -1) {
                return recFunc(recFunc(OBJECT, search.split(".")), suit);
            }
            if (typeof options.customGet === "function") {
                if (options.customGet(OBJECT, search) !== undefined) {
                    return recFunc(options.customGet(OBJECT, search), suit);
                }
            } else {
                if (OBJECT[search] !== undefined) {
                    return recFunc(OBJECT[search], suit);
                }
            }
            return new notFoundsSearchInObject();
        }
        return OBJECT;
    };
    return recFunc(OBJECT, Array.from(suit));
}

function getProtoRecursive(proto) {
    if (proto === Object.prototype) {
        return [proto];
    }
    return [proto, ...getProtoRecursive(proto.__proto__)];
}

const TypedArray = getProtoRecursive(Uint8Array)[1];

class Association {}

const string_class = new class string_class extends Association {
    TypedArray = TypedArray;
}();

const proxy_set = new WeakSet();
global.Proxy = new Proxy(Proxy, {
    construct(target, args) {
        if (args[1] instanceof Object) {
            if (args[1].getOwnPropertyDescriptor instanceof Function) {
                const getOwnPropertyDescriptor = args[1].getOwnPropertyDescriptor;
                args[1].getOwnPropertyDescriptor = function(target, prop) {
                    if (prop === "[[handler]]") {
                        return { configurable: true, enumerable: true, value: this };
                    }
                    if (prop === "[[target]]") {
                        return { configurable: true, enumerable: true, value: target };
                    }
                    return getOwnPropertyDescriptor(target, prop);
                };
            } else {
                args[1].getOwnPropertyDescriptor = function(target, prop) {
                    if (prop === "[[handler]]") {
                        return { configurable: true, enumerable: true, value: this };
                    }
                    if (prop === "[[target]]") {
                        return { configurable: true, enumerable: true, value: target };
                    }
                    return Object.getOwnPropertyDescriptor(target, prop);
                };
            }
        } else {
            args[1] = {
                getOwnPropertyDescriptor(target, prop) {
                    if (prop === "[[handler]]") {
                        return { configurable: true, enumerable: true, value: this };
                    }
                    if (prop === "[[target]]") {
                        return { configurable: true, enumerable: true, value: target };
                    }
                    return Object.getOwnPropertyDescriptor(target, prop);
                }
            };
        }
        const proxy = new target(...args);
        proxy_set.add(proxy);
        return proxy;
    }
});

const isProxy = function(obj) {
    return proxy_set.has(obj);
};

function getAllKeysConditionally(
    obj,
    includeSelf = true,
    includePrototypeChain = true,
    includeTop = false,
    includeEnumerables = true,
    includeNonenumerables = true,
    includeStrings = true,
    includeSymbols = true
) {
    // Boolean (mini-)functions to determine any given key's eligibility:
    const isEnumerable = (obj, key) => Object.propertyIsEnumerable.call(obj, key);
    const isString = key => typeof key === "string";
    const isSymbol = key => typeof key === "symbol";
    const includeBasedOnEnumerability = (obj, key) => (includeEnumerables && isEnumerable(obj, key)) || (includeNonenumerables && !isEnumerable(obj, key));
    const includeBasedOnKeyType = key => (includeStrings && isString(key)) || (includeSymbols && isSymbol(key));
    const include = (obj, key) => includeBasedOnEnumerability(obj, key) && includeBasedOnKeyType(key);
    const notYetRetrieved = (keys, key) => !keys.includes(key);

    // filter function putting all the above together:
    const filterFn = key => notYetRetrieved(keys, key) && include(obj, key);

    // conditional chooses one of two functions to determine whether to exclude the top level or not:
    const stopFn = includeTop ? obj => obj === null : obj => Object.getPrototypeOf(obj) === null;

    // and now the loop to collect and filter everything:
    let keys = [];
    while (!stopFn(obj, includeTop)) {
        if (includeSelf) {
            const ownKeys = Reflect.ownKeys(obj).filter(filterFn);
            keys = keys.concat(ownKeys);
        }
        if (!includePrototypeChain) {
            break;
        } else {
            includeSelf = true;
            obj = Object.getPrototypeOf(obj);
        }
    }
    return keys;
}

global.getAllKeysConditionally = getAllKeysConditionally;

const deepCopy = (totalObject, { deepMax, allCallback, deepSearchAndDeepAddOptions = {}, OwnProperty = false }) =>
    deepReplacer(totalObject, {
        deepMax,
        allCallback,
        deepSearchAndDeepAddOptions,
        OwnProperty
    });

function deepReplacer(
    totalObject,
    {
        deepMax,
        cycleCallback,
        eachCallback,
        allCallback,
        defaultObject,
        deepSearchAndDeepAddOptions = {},
        OwnProperty = false,
        include: { includeSelf = true, includePrototypeChain = false, includeTop = false, includeEnumerables = true, includeNonenumerables = true, includeStrings = true, includeSymbols = true } = {},
        seenType = "deep" // deep or linear
    } = {}
) {
    const includes = [includeSelf, includePrototypeChain, includeTop, includeEnumerables, includeNonenumerables, includeStrings, includeSymbols];
    allCallback = typeof allCallback === "function" ? allCallback : function() {};
    let totalNewObject;

    if (defaultObject) {
        totalNewObject = defaultObject;
    } else if (typeof totalObject === "object" && totalObject !== null) {
        if (Array.isArray(totalObject)) {
            totalNewObject = Object.assign([], totalObject);
            Object.setPrototypeOf(totalNewObject, Object.getPrototypeOf(totalObject));
        } else {
            if (isProxy(totalObject)) {
                totalNewObject = new Proxy({}, {});
            } else if (totalObject instanceof Promise) {
                totalNewObject = totalObject.then();
            } else if (totalObject instanceof Date) {
                totalNewObject = new Date(totalObject);
            } else if (totalObject instanceof RegExp) {
                totalNewObject = new RegExp(totalObject);
            } else if (totalObject instanceof Error) {
                totalNewObject = new Error(totalObject);
            } else if (totalObject instanceof string_class.TypedArray) {
                totalNewObject = totalObject;
            } else {
                totalNewObject = new Object();
                Object.setPrototypeOf(totalNewObject, Object.getPrototypeOf(totalObject));
            }
        }
    } else {
        return totalObject;
    }

    allCallback({ item: totalNewObject, actualPath: [], deep: 0 });

    if (totalNewObject instanceof deepReplacer.constraint.End) {
        return totalNewObject.get();
    }

    function rec(item, path, map) {
        let _callbackArray = [];
        let parentReady = function(callback = function() {}) {
            _callbackArray.push([callback, path.at(-1)]);
        };
        if (path.length > deepMax) {
            return;
        }

        if (typeof item === "object" && item !== null && !(item instanceof string_class.TypedArray)) {
            // console.log(map);
            if (map.has(item)) {
                if (typeof cycleCallback === "function") {
                    addInObject(
                        totalNewObject,
                        path,
                        cycleCallback({ totalNewObject, item, actualPath: path, parentPath: map.get(item), defaultReturn: searchInObject(totalNewObject, map.get(item)) }),
                        deepSearchAndDeepAddOptions
                    );
                } else {
                    addInObject(totalNewObject, path, searchInObject(totalNewObject, map.get(item), deepSearchAndDeepAddOptions), deepSearchAndDeepAddOptions);
                }
            } else {
                // map.set(item, path);
                if (Array.isArray(item)) {
                    if (path.length !== 0) {
                        let toAdd;
                        toAdd = Object.assign([], item);
                        Object.setPrototypeOf(toAdd, Object.getPrototypeOf(item));
                        if (typeof eachCallback === "function") {
                            toAdd = eachCallback({ totalNewObject, item, actualPath: path, defaultReturn: toAdd, parentReady });
                        }
                        if (toAdd instanceof deepReplacer.constraint.End) {
                            addInObject(totalNewObject, path, toAdd.get(), deepSearchAndDeepAddOptions);
                        } else {
                            addInObject(totalNewObject, path, toAdd, deepSearchAndDeepAddOptions);
                            getAllKeysConditionally(item, ...includes).forEach(function(key) {
                                if (seenType === "linear") {
                                    rec(item[key], path.concat(key), map.set(item, path));
                                } else {
                                    rec(item[key], path.concat(key), new Map([...map, [item, path]]));
                                }
                            });
                        }
                    } else {
                        getAllKeysConditionally(item, ...includes).forEach(function(key) {
                            if (seenType === "linear") {
                                rec(item[key], path.concat(key), map.set(item, path));
                            } else {
                                rec(item[key], path.concat(key), new Map([...map, [item, path]]));
                            }
                        });
                    }
                } else {
                    if (path.length !== 0) {
                        let toAdd;
                        if (isProxy(item)) {
                            toAdd = new Proxy({}, {});
                        } else if (item instanceof Promise) {
                            toAdd = item.then();
                        } else if (item instanceof Date) {
                            toAdd = new Date(item);
                        } else if (item instanceof RegExp) {
                            toAdd = new RegExp(item);
                        } else if (item instanceof Error) {
                            toAdd = new Error(item);
                        } else if (item instanceof string_class.TypedArray) {
                            toAdd = item;
                        } else {
                            toAdd = new Object();
                            Object.setPrototypeOf(toAdd, Object.getPrototypeOf(item));
                        }
                        if (typeof eachCallback === "function") {
                            toAdd = eachCallback({ totalNewObject, item, actualPath: path, defaultReturn: toAdd, parentReady });
                        }

                        if (toAdd instanceof deepReplacer.constraint.End) {
                            addInObject(totalNewObject, path, toAdd.get(), deepSearchAndDeepAddOptions);
                        } else {
                            if (OwnProperty) {
                                addInObject(
                                    totalNewObject,
                                    path,
                                    addInObject.defineOwnProperty(Object.getOwnPropertyDescriptor(searchInObject(totalObject, path.slice(0, -1)), path.at(-1))),
                                    deepSearchAndDeepAddOptions
                                );
                            } else {
                                addInObject(totalNewObject, path, toAdd, deepSearchAndDeepAddOptions);
                            }
                            getAllKeysConditionally(item, ...includes).forEach(function(key) {
                                if (seenType === "linear") {
                                    rec(item[key], path.concat(key), map.set(item, path));
                                } else {
                                    rec(item[key], path.concat(key), new Map([...map, [item, path]]));
                                }
                            });
                        }
                    } else {
                        getAllKeysConditionally(item, ...includes).forEach(function(key) {
                            if (seenType === "linear") {
                                rec(item[key], path.concat(key), map.set(item, path));
                            } else {
                                rec(item[key], path.concat(key), new Map([...map, [item, path]]));
                            }
                        });
                    }
                }
            }
        } else {
            let toAdd;
            if (typeof eachCallback === "function") {
                toAdd = eachCallback({ totalNewObject, item, actualPath: path, defaultReturn: item, parentReady });
            } else {
                if (OwnProperty) {
                    toAdd = addInObject.defineOwnProperty(Object.getOwnPropertyDescriptor(searchInObject(totalObject, path.slice(0, -1)), path.at(-1)));
                } else {
                    toAdd = item;
                }
            }
            if (toAdd instanceof deepReplacer.constraint.End) {
                addInObject(totalNewObject, path, toAdd.get(), deepSearchAndDeepAddOptions);
            } else {
                // console.log(toAdd)
                addInObject(totalNewObject, path, toAdd, deepSearchAndDeepAddOptions);
            }
        }
        let parent = searchInObject(totalNewObject, path.slice(0, -1), deepSearchAndDeepAddOptions);
        _callbackArray.forEach(([callback, propName]) => {
            callback([parent, propName]);
        });
        allCallback({ item, actualPath: path, deep: path.length });
        return totalNewObject;
    }

    try {
        return rec(totalObject, [], new Map());
    } catch (e) {
        console.error(e);
        throw new Error("an error occured on the replace function");
    }
}

deepReplacer.constraint = {
    End: class End {
        constructor(val) {
            this.val = val;
        }
        get() {
            return this.val;
        }
    }
};

function cycle(o, { include = {}, seenType = "deep" } = {}) {
    return deepReplacer(o, {
        cycleCallback: ({ parentPath }) => {
            // console.log(arguments)
            return `⏩${parentPath.join(".")}`;
        },
        // ! use for test
        // allCallback: ({ item, actualPath, parentReady }) => {
        //     console.log(actualPath);
        // },
        include,
        seenType
    });
}

function uncycle(o, { include } = {}) {
    return deepReplacer(o, {
        eachCallback: ({ defaultReturn, item, totalNewObject }) => {
            if (typeof item == "string" && item.startsWith("⏩")) {
                let ret = item.slice(1).length === 0 ? totalNewObject : searchInObject(totalNewObject, item.slice(1).split("."));
                if (ret instanceof notFoundsSearchInObject) {
                    return "";
                }
                return ret;
            }
            return defaultReturn;
        },
        include
    });
}

function isClass(c) {
    return typeof c === "function" && /^\s*class\s+/.test(c.toString());
}

const isArrowFunc = fn => typeof fn === "function" && /^[^{]+?=>/.test(fn.toString());

function isFunction(f) {
    return typeof f === "function" && !isClass(f);
}

function isAsyncFunction(f) {
    return isFunction(f) && f.constructor.name === "AsyncFunction";
}

const capitalizeFirstLetter = ([first, ...rest], locale = navigator.language) => (first === undefined ? "" : first.toLocaleUpperCase(locale) + rest.join(""));

const camelCase = x => {
    if (typeof x === "string") {
        return x.split(" ").map(w => capitalizeFirstLetter(w)).join("");
    }
    return x;
};

class NotFoundsMatch {}

function match(toMatch, obj, defaultVal) {
    let res = [...Object.entries(obj), ...Object.getOwnPropertySymbols(obj).map(sym => [sym, obj[sym]])].reduce(function(prev, [key, val]) {
        if (!(prev instanceof NotFoundsMatch)) {
            return prev;
        }
        if (toMatch === key && key !== match.typeof && key !== match.instanceof && key !== match.rest) {
            return val;
        }
        if (key == match.typeof) {
            return Object.entries(val).reduce(function(prev, [key, val]) {
                if (!(prev instanceof NotFoundsMatch)) {
                    return prev;
                }
                if (typeof toMatch === key || (typeof key === toMatch && toMatch !== "string")) {
                    if (typeof val === "function") {
                        return val(toMatch);
                    }
                    return val;
                }
                return prev;
            }, new NotFoundsMatch());
        }
        if (key === match.instanceof) {
            return val.reduce(function(prev, [key, val]) {
                // console.log(toMatch);
                // console.log(key);
                if (!(prev instanceof NotFoundsMatch)) {
                    return prev;
                }
                try {
                    if (toMatch instanceof key) {
                        if (typeof val === "function") {
                            return val(toMatch);
                        }
                        return val;
                    }
                } catch (e) {
                    try {
                        if (key instanceof toMatch) {
                            if (typeof val === "function") {
                                return val(toMatch);
                            }
                            return val;
                        }
                    } catch (e) {
                        return prev;
                    }
                }
                return prev;
            }, new NotFoundsMatch());
        }
        if (key === match.rest) {
            return val.reduce(function(prev, [key, val]) {
                if (!(prev instanceof NotFoundsMatch)) {
                    return prev;
                }
                if (typeof key === "function") {
                    if (key(toMatch)) {
                        if (typeof val === "function") {
                            return val(toMatch);
                        }
                        return val;
                    }
                }
                if (toMatch === key) {
                    if (typeof val === "function") {
                        return val(toMatch);
                    }
                    return val;
                }
                return prev;
            }, new NotFoundsMatch());
        }
        if (key === match.primitive) {
            return val.reduce(function(prev, [key, val]) {
                if (!(prev instanceof NotFoundsMatch)) {
                    return prev;
                }
                if (primitiveValue(toMatch).is(key)) {
                    if (typeof val === "function") {
                        return val(toMatch);
                    }
                    return val;
                }
                return prev;
            }, new NotFoundsMatch());
        }
        return prev;
    }, new NotFoundsMatch());

    if (res instanceof NotFoundsMatch) {
        if (typeof defaultVal === "function") {
            res = defaultVal(toMatch);
        } else {
            res = defaultVal;
        }
    }
    if (typeof res === "function") {
        return res();
    }
    return res;
}

match.rest = Symbol("rest");
match.typeof = Symbol("typeof");
match.instanceof = Symbol("instanceof");
match.primitive = Symbol("primitive");

function isJson(s) {
    try {
        JSON.parse(s);
        return true;
    } catch (e) {
        return false;
    }
}

const uuidv5 = () => {
    var crypto = window.crypto || window.msCrypto; // for IE 11
    if (crypto == undefined) {
        throw new Error("crypto is undefined");
    }
    var bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x50;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    var hex = Array.prototype.map
        .call(bytes, function(byte) {
            return ("0" + byte.toString(16)).slice(-2);
        })
        .join("");
    return hex;
};

const flattenObject = function(ob) {
    var toReturn = {};

    for (var i in ob) {
        if (!ob.hasOwnProperty(i)) continue;

        if (typeof ob[i] == "object") {
            var flatObject = flattenObject(ob[i]);
            for (var x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[i + "." + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
};

function deepEqual(...objs) {
    if (objs.length < 2) {
        return true;
    }

    if (objs.some(obj => typeof obj !== "object" || obj === null)) {
        return objs.reduce((a, b) => (typeof a === "number" && isNaN(a) ? isNaN(a) && isNaN(b) && typeof b === "number" : a === b));
    }

    // this function cycle an object then stringify it and parse it (to remove the function and other non json object) then flatten it and re stringify it with the sort method (in the end the object is sorted by pathName)
    let [cycledFLattenedStringifyFirst, ...cycledFLattenedStringifyOthers] = objs.map(o => {
        let cycledFlattenedObject = flattenObject(JSON.parse(JSON.stringify(cycle(o))));
        return JSON.stringify(cycledFlattenedObject, Object.keys(cycledFlattenedObject).sort());
    });

    // this loop iterate over the first object and compare it with the others
    for (let i = 0; i < cycledFLattenedStringifyOthers.length; i++) {
        if (JSON.stringify(cycledFLattenedStringifyFirst) !== JSON.stringify(cycledFLattenedStringifyOthers[i])) {
            return false;
        }
    }
    return true;
}

const ContainerSym = {
    parent: Symbol("parent"),
    innerVar: Symbol("innerVar")
};

class ContainerExtends {
    /**
     * @param parent - The parent object. If you don't specify a parent, the object will be a root
     * object.
     * @param [params] - A dictionary of parameters that are passed to the constructor.
     */
    constructor(parent, params = {}) {
        if (parent) {
            Object.defineProperty(this, ContainerSym.parent, {
                configurable: false,
                enumerable: false,
                get() {
                    return parent;
                },
                set() {
                    throw new Error("You can't change the parent of a Container object");
                }
            });
        } else {
            Object.defineProperty(this, ContainerSym.parent, {
                configurable: false,
                enumerable: false,
                get() {
                    return this;
                },
                set() {
                    throw new Error("You can't change the parent of a Container object");
                }
            });
        }
        Object.defineProperty(this, ContainerSym.innerVar, {
            configurable: false,
            enumerable: false,
            get() {
                return {
                    id: params.id
                };
            },
            set() {
                throw new Error("You can't change the innerVar of a Container object");
            }
        });
    }

    /**
     * Get the parent of the current object
     * @returns The parent of the current object.
     */
    __getParent() {
        return this[ContainerSym.parent];
    }

    /**
     * Given an id, return the parent of the element with that id
     * @param id - The id of the parent you want to find.
     * @returns The parent with the specified id.
     */
    __getParentById(id) {
        return this[ContainerSym.innerVar].id == id ? this : this.__isHighestParent() ? undefined : this.__getParent().__getParentById(id);
    }

    /**
     * Returns true if the current object is the highest parent in the hierarchy
     * @returns The __isHighestParent() method returns a boolean value.
     */
    __isHighestParent() {
        if (this.__getParent() === this) {
            return true;
        }
        return false;
    }

    /**
     * Returns the highest parent of the current element
     * @returns The highest parent of the current object.
     */
    __getHighestParent() {
        if (this.__isHighestParent()) {
            return this;
        }
        if (this.__getParent() instanceof ContainerExtends) return this.__getParent().__getHighestParent();
        else return this.__getParent();
    }
}

class Container {
    constructor(parent, property, params = {}) {
        return Object.assign(new class extends ContainerExtends {}(parent, params), property);
    }
}

/**
 * It takes an array or a single element and returns an array of elements that are not in the
 * second argument.
 * @param {Array | any} elmt - The element to be parsed.
 * @param {Array} [toAvoid] - The array of items to avoid.
 * @returns {Array} an array of elements that are not in the toAvoid array.
 */
const parse = function parse(elmt, toAvoid = []) {
    let arr = elmt;
    if (!Array.isArray(toAvoid)) {
        toAvoid = this.parse(toAvoid);
    }
    if (!Array.isArray(elmt)) {
        arr = [elmt];
    }
    return arr.filter(function(item) {
        if (!toAvoid.includes(item)) {
            return true;
        }
        return false;
    });
};

module.exports = {
    uncycle,
    cycle,
    deepCopy,
    searchInObject,
    addInObject,
    deepReplacer,
    isClass,
    isArrowFunc,
    isFunction,
    isAsyncFunction,
    isJson,
    uuidv5,
    isProxy,
    match,
    camelCase,
    getProtoRecursive,
    flattenObject,
    deepEqual,
    ContainerSym,
    ContainerExtends,
    Container,
    parse
};
