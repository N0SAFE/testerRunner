import { searchInObject, removeInObject, addInObject, parse, notFoundsTypesDeclarator } from "./bundle.js";
import { notFoundsTypesDeclarator } from "./typesDeclarator/_.js";
import { primitiveValue } from "./primitiveValue/function.js";

export class Undefined {}
export class HandleTypeVerif {
    constructor(typeVerif, { sucess, error }) {
        this.typeVerif = typeVerif;
        this.func = { sucess, error };
    }
}
export class ForceClass {
    constructor(Class) {
        this.class = Class;
    }
}
export class ForceFunction {
    constructor(func) {
        this.func = func;
    }
}
export class ChangeRetPath {
    constructor(actualPath, newPath, deleteOldPath = true) {
        this.actualPath = actualPath;
        this.newPath = newPath;
        this.deleteOldPath = deleteOldPath;
    }
}

function isObject(obj) {
    return obj && typeof obj === "object" && !Array.isArray(obj);
}

function isArray(obj) {
    return Array.isArray(obj);
}

function deepMerge(source) {
    let output = {};
    if (isArray(source)) {
        output = [];
    }
    Object.keys(source).forEach(key => {
        if (isObject(source[key]) || isArray(source[key])) {
            if (source[key][verif.objectEndSymbol]) {
                output[key] = source[key].val;
            } else {
                output[key] = deepMerge(source[key]);
            }
        } else {
            output[key] = source[key];
        }
    });
    return output;
}

/**
 * It takes an object, a constraint, and an object with two functions, error and success. It then loops
 * through the constraint, and if it finds a path that doesn't match the constraint, it calls the error
 * function. If it finds no errors, it calls the success function
 * @param { Object } obj - the object to verify
 * @param { Object } constraint - an array of objects that contains the following parameters:
 * @param { ()=>{} } error - an error function that is called if the object doesn't match the constraint
 * @param { ()=>{} } success - an success function that is called if there are no errors
 * @returns { boolean } - true if there are no errors, false if there are errors
 */
export function verif(obj, constraint, { error, success } = {}) {
    let last = {};

    if (Array.isArray(obj)) {
        obj = obj.reduce((acc, [key, val]) => {
            acc[key] = verif.objectEnd(val);
            return acc;
        }, {});
    }

    let retObject = deepMerge(obj);

    let ret = constraint.every(function({ path, paths, types, typesPrimitive, default: Default }) {
        // if path == undefined return the acc to continue the loop and avoid the path
        if (path == undefined && paths == undefined) {
            console.error("an error occure during the parse of the args");
            last = { path, types, value };
            return false;
        }

        // defaultVal as to default a anonymous function that can't be replicate (so we can compare if the defaultVal is the same as the actual val without having a conflict)
        let defaultBool = false;
        if (path) {
            paths = [path]; // parse is a function that verify if the args is an array (if not it transform into an array)
        }

        return paths.every(function(path) {
            let changeRetPath;
            if (path instanceof ChangeRetPath) {
                changeRetPath = path;
                path = path.actualPath;
            }
            path = parse(path);
            let value = searchInObject(retObject, path);
            if (changeRetPath instanceof ChangeRetPath) {
                if (changeRetPath.deleteOldPath) {
                    removeInObject(retObject, parse(changeRetPath.actualPath));
                    addInObject(retObject, parse(changeRetPath.newPath), value);
                }
                path = parse(changeRetPath.newPath);
            }
            if (value instanceof notFoundsTypesDeclarator.searchInObject) {
                value = undefined;
            }

            if (value === undefined) {
                if (Default !== undefined) {
                    let forceFunction = Default instanceof ForceFunction;
                    if (typeof Default == "function" && !forceFunction) {
                        addInObject(retObject, path, Default(value));
                    } else {
                        if (forceFunction) {
                            Default = Default.func;
                        }
                        if (Default instanceof Undefined) {
                            addInObject(retObject, path, undefined);
                        } else {
                            addInObject(retObject, path, Default);
                        }
                    }
                } else {
                    addInObject(retObject, path, undefined);
                }
                defaultBool = true;
            }
            if ((types || typesPrimitive) && !defaultBool) {
                if (!Array.isArray(types)) {
                    throw new Error("the types arguments must be an array");
                }

                if (typesPrimitive !== undefined) {
                    return primitiveValue(value).is(...typesPrimitive);
                }

                if (
                    !types.some(function(type) {
                        let func = function(type) {
                            // this test can define if the var is a callback
                            let forceClass = false;
                            try {
                                if (type instanceof ForceClass) {
                                    forceClass = true;
                                }
                            } catch (e) {}

                            if (primitiveValue(type).is("function", primitiveValue.not("class"))) {
                                return type(value);
                            } else if (type instanceof ForceFunction) {
                                return type.func(value);
                            }

                            if (forceClass) {
                                type = type.class;
                            }
                            try {
                                if (value instanceof type) {
                                    return true;
                                }
                            } catch (e) {}
                            if (value === type) {
                                return true;
                            }
                            if (typeof value === type) {
                                return true;
                            }
                            if (typeof value === "string" && type == String) {
                                return true;
                            }
                            if (typeof value === "number" && type == Number) {
                                return true;
                            }
                            return false;
                        };
                        if (type instanceof HandleTypeVerif) {
                            let bool = func(type.typeVerif);
                            if (bool) {
                                if (type.func.sucess) {
                                    addInObject(retObject, path, type.func.sucess(value));
                                } else {
                                    addInObject(retObject, path, Default);
                                }
                            }
                            if (!bool) {
                                if (type.func.error) {
                                    addInObject(retObject, path, type.func.error(value));
                                } else {
                                    addInObject(retObject, path, Default);
                                }
                            }
                            return true;
                        } else {
                            return func(type);
                        }
                    })
                ) {
                    if (Default !== undefined) {
                        let forceFunction = Default instanceof ForceFunction;
                        if (typeof Default == "function" && !forceFunction) {
                            addInObject(retObject, path, Default(value));
                        } else {
                            if (forceFunction) {
                                Default = Default.func;
                            }
                            if (Default instanceof Undefined) {
                                addInObject(retObject, path, undefined);
                            } else {
                                addInObject(retObject, path, Default);
                            }
                        }
                        return true;
                    }
                    last = { path, types, value };
                    return false;
                }
            }
            return true;
        });
    });

    if (ret === false) {
        if (typeof error === "function") {
            return error({
                obj: retObject,
                lastPath: last.path,
                lastValue: last.value,
                lastTypes: last.types,
                constraint
            });
        } else {
            throw new Error("the args '" + last.path.join(".") + "' does not match the constraint");
        }
    }
    if (typeof success === "function") {
        return success(retObject, constraint);
    } else {
        return retObject;
    }
}

verif.objectEnd = function(val) {
    return {
        [verif.objectEndSymbol]: verif.objectEndSymbol,
        val
    };
};

verif.objectEndSymbol = Symbol("objectEnd");
