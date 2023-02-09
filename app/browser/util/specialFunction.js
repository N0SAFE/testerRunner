import { describe, it, test, expect } from './JestMethods.js'
import { cycle, uncycle, isFunction, isAsyncFunction, uuidv5, deepEqual } from "./bundle.js";
import iFunc from './iFunc.js'
import * as testTemplate from './testTemplate.js'
import ImportError from "./logTemplate/ImportError.js"

export function testTemplateUse(wrap) {
    return {
        default: new Proxy(testTemplate, {
            get: function (target, prop) {
                if (target[prop] instanceof Function) {
                    return function (...args) {
                        return target[prop].call(wrap, {
                            describe: describe.bind(wrap),
                            it: it.bind(wrap),
                            test: test.bind(wrap),
                            expect: expect.bind(wrap),
                            iFunc: iFunc
                        }, args, wrap);
                    };
                } else {
                    return target[prop];
                }
            },
            set: function () {
                throw new Error("Can't set value");
            }
        })
    };
}

// this function is here to set to the server what is the current targeted file to test (it has to be use in the start of the test file)
export function pathModuleTest(path) {
    h0xtyueiifhbc_PathModuleTest(new URL(window.h0xtyueiifhbc + "/../" + path).href);
}

export function depend(){
    
}

// this function is used to import other module (like other test before starting this)
export async function importNeed(arr) {
    let res = {};
    for (let i = 0; i < arr.length; i++) {
        if (!Array.isArray(arr[i])) {
            throw new Error("the element in the array for the importNeed function has to be another array");
        }
        const [importPath, name] = arr[i];
        if (new URL(window.h0xtyueiifhbc + "/../" + importPath).href.endsWith(".browser.test.js")) {
            try {
                let importTestPath = await h0xtyueiifhbc_ImportTestPath(new URL(window.h0xtyueiifhbc + "/../" + importPath).href);
                console.log(importTestPath)
                if (importTestPath.isOk) {
                    try {
                        res[name] = await import(importTestPath.pathModuleTest);
                    } catch {
                        console.log(importTestPath);
                        if (!window.h0xtyueiifhbc_TestIsFinish) {
                            console.trace("test is finish");
                            window.h0xtyueiifhbc_TestIsFinish = true;
                            h0xtyueiifhbc_ThrowError(
                                new ImportError(
                                    "the testModule " + new URL(window.h0xtyueiifhbc + "/../" + importPath).href + " handle a fail",
                                    new URL(window.h0xtyueiifhbc + "/../" + importPath).href,
                                    {
                                        previous: importTestPath.stack
                                    }
                                )
                            );
                        }
                    }
                } else {
                    console.log(importTestPath);
                    if (!window.h0xtyueiifhbc_TestIsFinish) {
                        console.trace("test is finish");
                        window.h0xtyueiifhbc_TestIsFinish = true;
                        h0xtyueiifhbc_ThrowError(
                            new ImportError("the testModule " + new URL(window.h0xtyueiifhbc + "/../" + importPath).href + " handle a fail", new URL(window.h0xtyueiifhbc + "/../" + importPath).href, {
                                previous: importTestPath.stack
                            })
                        );
                    }
                    // h0xtyueiifhbc_ThrowError("the testModule " + new URL(window.h0xtyueiifhbc + "/../" + importPath).href + " handle a fail \n\n\n" + importTestPath.stack);

                    console.log(importTestPath);
                    console.error(importTestPath.stack);
                    throw new Error("the testModule " + new URL(window.h0xtyueiifhbc + "/../" + importPath).href + " handle a fail");
                }
            } catch (e) {
                if (!window.h0xtyueiifhbc_TestIsFinish) {
                    console.trace("test is finish");
                    window.h0xtyueiifhbc_TestIsFinish = true;
                    h0xtyueiifhbc_ThrowError(
                        new ImportError("the testModule " + new URL(window.h0xtyueiifhbc + "/../" + importPath).href + " handle a fail", new URL(window.h0xtyueiifhbc + "/../" + importPath).href, {
                            error: e
                        })
                    );
                }
                // h0xtyueiifhbc_ThrowError("the testModule " + new URL(window.h0xtyueiifhbc + "/../" + importPath).href + " handle a fail" + "\n\n\n" + e.stack);

                console.error(e);
                throw new Error("the testModule " + new URL(window.h0xtyueiifhbc + "/../" + importPath).href + " handle a fail");
            }
        } else {
            try {
                console.log("import " + name);
                res[name] = await import(new URL(window.h0xtyueiifhbc + "/../" + importPath).href);
            } catch (e) {
                if (!window.h0xtyueiifhbc_TestIsFinish) {
                    console.trace("test is finish");
                    window.h0xtyueiifhbc_TestIsFinish = true;
                    h0xtyueiifhbc_ThrowError(
                        new ImportError("the testModule " + new URL(window.h0xtyueiifhbc + "/../" + importPath).href + " handle a fail", new URL(window.h0xtyueiifhbc + "/../" + importPath).href, {
                            error: e
                        })
                    );
                }
                // h0xtyueiifhbc_ThrowError("import " + new URL(window.h0xtyueiifhbc + "/../" + importPath).href + " failed \n\n\n" + e.stack);

                console.error(e);
                throw new Error("import " + new URL(window.h0xtyueiifhbc + "/../" + importPath).href + " failed");
            }
        }
    }
    return res;
}

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}

class Dir {
    directFiles() {
        return Object.entries(this).filter(([k, v]) => typeof v === "string");
    }

    deepFiles(deep = Infinity) {
        return Object.entries(this)
            .map(function ([k, v]) {
                if (deep === 0) {
                    return [];
                }
                if (v instanceof Dir) {
                    return v.deepFiles(deep - 1);
                } else if (typeof v === "string") {
                    return v;
                } else {
                    return [];
                }
            })
            .flat();
    }

    directDirectories() {
        return Object.entries(this).filter(([k, v]) => v instanceof Dir);
    }

    deepDirectories(deep) {
        return Object.entries(this)
            .map(function ([k, v]) {
                if (deep === 0) {
                    return [];
                }
                if (v instanceof Dir) {
                    return [v, ...v.deepDirectories(deep - 1)];
                } else {
                    return [];
                }
            })
            .flat();
    }

    directAll() {
        return Object.entries(this).filter(([k, v]) => v instanceof Dir || typeof v === "string");
    }

    deepAll(deep) {
        return Object.entries(this)
            .map(function ([k, v]) {
                if (deep === 0) {
                    return [];
                }
                if (v instanceof Dir) {
                    return [v, ...v.deepAll(deep - 1)];
                } else if (typeof v === "string") {
                    return v;
                } else {
                    return [];
                }
            })
            .flat();
    }
}

async function handleDir(path) {
    const promisesFunction = [];
    const allFile = await h0xtyueiifhbc_GetAllFileInDir(transformPathWebToFile(new URL(window.h0xtyueiifhbc + "/../" + path).href)).then(function (arr) {
        return arr.map(function (_path) {
            return _path.replace(/\\/g, "/").replace(transformPathWebToFile(new URL(window.h0xtyueiifhbc + "/../" + path).href), "");
        });
    });
    const allFileAsObject = await allFile.reduce(async (acc, file) => {
        acc = await acc;
        const _path = file.replace(/\\/g, "/").split("/");
        const fileName = _path.pop();
        const dir = _path.reduce((acc, dir) => {
            acc[dir] = acc[dir] || new Dir();
            return acc[dir];
        }, acc);

        let res;
        dir[fileName] = new Promise((resolve) => (res = resolve));

        console.log(new URL(window.h0xtyueiifhbc + "/../" + path + (file.startsWith("/") || file.startsWith("\\") ? file.slice(1) : file)).href);

        let x = new XMLHttpRequest();
        x.open("GET", new URL(window.h0xtyueiifhbc + "/../" + path + (file.startsWith("/") || file.startsWith("\\") ? file.slice(1) : file)).href, false);
        x.onreadystatechange = function () {
            if (x.readyState === 4) {
                if (x.status === 200) {
                    res(x.responseText);
                } else {
                    res(new NotFoundError("File not found"));
                }
            }
        };
        x.send();

        promisesFunction.push(async function () {
            console.log("tet");
            return (dir[fileName] = await dir[fileName]);
        });
        return acc;
    }, new Dir());

    return { promisesFunction, allFileAsObject };
}

function handleFile(path) {
    return fetch(path).then((res) => res.text());
}

// this function is used to import some data from file (it's a XMLHttpRequest)
export async function requiredFiles(arr) {
    const allPromises = [];
    let ret = await arr.reduce(async function (acc, obj) {
        acc = await acc;
        if (!obj.name) {
            throw new Error("missing name");
        }
        if (obj.paths) {
            acc[obj.name] = await Promise.all(
                obj.paths.map(async function (path) {
                    const file = path;
                    if (file.endsWith("/")) {
                        let ret = await handleDir(file);
                        allPromises.push(...ret.promisesFunction);
                        return ret.allFileAsObject;
                    } else {
                        let ret = handleFile(file);
                        allPromises.push(async function () {
                            return (acc[obj.name] = await ret);
                        });
                        return ret;
                    }
                })
            );
        } else if (obj.path) {
            acc[obj.name] = await (async () => {
                const file = obj.path;
                if (file.endsWith("/")) {
                    let ret = await handleDir(file);
                    allPromises.push(...ret.promisesFunction);
                    return ret.allFileAsObject;
                } else {
                    let ret = handleFile(file);
                    allPromises.push(async function () {
                        return (acc[obj.name] = await ret);
                    });
                    return ret;
                }
            })();
        } else {
            throw new Error("missing path");
        }
        return acc;
    }, {});

    await Promise.all(
        allPromises.map(async function (callback) {
            let ret = await callback();
            if (ret instanceof NotFoundError) {
                throw ret;
            } else {
                return ret;
            }
        })
    );

    console.log(await ret);
    return await ret;
}

export function transformPathWebToFile(path) {
    path = path.replace("file:///", "").replace(/\\/g, "/");
    return path.charAt(0).toUpperCase() + path.slice(1);
}

export function transformPathFileToWeb(path) {
    path = path.replace(/\\/g, "/");
    path = path.charAt(0).toUpperCase() + path.slice(1);
    return "file:///" + path;
}

export function toStringComplexe(s) {
    if (typeof s === "object") {
        let stringify = JSON.stringify(
            cycle(s),
            function (key, value) {
                return typeof value === "function" ? value.toString() : value;
            },
            4
        );
        if (stringify === "{}") {
            stringify = JSON.stringify(
                cycle(s, { include: { includeTop: true } }),
                function (key, value) {
                    return typeof value === "function" ? value.toString() : value;
                },
                4
            );
        }
        return stringify;
    }
    return s;
}