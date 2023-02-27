const { Worker, isMainThread, parentPort, workerData } = require("node:worker_threads");
const puppeteer = require("puppeteer");
const fs = require("fs");
const cliProgress = require("cli-progress");
const colors = require("colors");
const _path = require("path");
const { randomUUID } = require("crypto");
const { addInObject } = require("./util/bundle.js");
const ansi = require("ansi"),
    cursor = ansi(process.stdout);

const pathToHtmlFile = _path.join(__dirname, "../test.html");
const pathToClientJsFile = _path.join(__dirname, "../browser/browser.tester.js");

function useMessager() {
    async function actionMessager({ actionName, actionProperty }, context) {
        parentPort.postMessage({
            type: "action",
            actionName,
            actionProperty,
            context
        });
    }

    async function deadStatusMessager({ statusType, stack }, context) {
        parentPort.postMessage({
            type: "deadStatus",
            statusType,
            stack,
            context
        });
    }

    async function infoMessager(info) {
        parentPort.postMessage({
            type: "info",
            info
        });
    }

    return {
        actionMessager,
        deadStatusMessager,
        infoMessager
    };
}
module.exports = {
    useMessager
};

const { actionMessager, deadStatusMessager, infoMessager } = useMessager();

function pathNormalize(location, path, type) {
    path = path.replaceAll("\\", "/");
    if (type === "file") {
        return pathToAbsolute(location, path.replaceAll("file:///", "")).replaceAll("\\", "/");
    }
    if (type === "url") {
        if (!path.startWith("file:///")) {
            path = "file:///" + pathToAbsolute(location, path);
        }
        return path.replaceAll("\\", "/");
    }
    throw new Error("the type has to be file or url");
}

function pathToAbsolute(location, path) {
    if (!isAbsolute(path)) {
        return _path.resolve(location, path);
    }
    return path;
}

const { hasCycle, readdirSync, transformPathFileToWeb, transformPathWebToFile } = require("./function.js");
const { isAbsolute } = require("node:path");

(async ({ filesPath, innerConfig, displayGhostWithMultipleTestAtTheSameTime, dir: { debugDir, errorDir, logDir } }) => {
    const browser = await puppeteer.launch({
        headless: !innerConfig.screen.state,
        devtools: true,
        args: ["--disable-web-security", "--disable-features=IsolateOrigins", "--disable-site-isolation-trials"]
    });

    infoMessager("puppeteer lauched");

    let startingPage = await browser.newPage();
    await startingPage.goto("about:blank");
    await startingPage.close();

    infoMessager("ready");

    console.log(
        colors.green("start") +
            "   " +
            colors.yellow("0/" + (filesPath.length + 1)) +
            " " +
            (filesPath.length + 1 > 1 ? "files" : "file") +
            "      " +
            (displayGhostWithMultipleTestAtTheSameTime ? colors.yellow("WARN :") + " " + colors.red("the display ghost can't be enable when multiple test at the same time is enabled") : "")
    );
    console.log();

    // const multibar = new cliProgress.MultiBar(
    //     {
    //         hideCursor: true,
    //         stopOnComplete: false,
    //         emptyOnZero: true,
    //         format: colors.cyan("{bar}") + "| {percentage}% || {value}/{total} Wraps | {file} | {status}"
    //     },
    //     cliProgress.Presets.shades_grey
    // );

    /**
    * @type {Set<cliProgress.SingleBar>}
    */
    // const activeBar = new Set();

    const loadedPromise = {};
    const loadedProp = {};
    const testImport = {};

    const allTest = {
        importedTest: {},
        async createMain(actualPath, from) {
            const test = await allTest._create(actualPath, false, from);
            return (allTest._main._prop[test.info.uuid] = test);
        },
        async createGhost(actualPath, from) {
            const test = await allTest._create(actualPath, true, from);
            return (allTest._ghost._prop[test.info.uuid] = test);
        },
        async _create(actualPath, isGhost, from = []) {
            const uuid = randomUUID();
            const currentTest = {
                time: {
                    startTime: undefined, // it is defined when the test start
                    endTime: undefined // it is defined after
                },
                status: {
                    start: {
                        toggleMainStart: function() {
                            currentTest.status.start.isMainStarted = true;
                        },
                        toggleStart: function() {
                            currentTest.status.start.isStarted = true;
                        },
                        isMainStarted: false,
                        isStarted: false
                    },
                    isOk: function() {
                        return currentTest.status.dead.isDead === false;
                    },
                    dead: {
                        isDead: false,
                        lastType: false,
                        stack: [],
                        fatal: false,
                        toggle(actualType, stack, fatal = false) {
                            parentPort.postMessage(
                                colors.bold.red(`toggle dead status  {${actualType}} ==> `) + colors.blue(currentTest.info.actualPath) + colors.yellow("    status ==> ") + colors.bold.red(stack)
                            );
                            // console.log(currentTest.status);
                            if (!currentTest.status.dead.fatal) {
                                currentTest.status.dead.isDead = true;
                                currentTest.status.dead.lastType = actualType;
                                currentTest.status.dead.stack.push([actualType, stack]);
                            }
                            if (fatal) {
                                currentTest.status.dead.fatal = true; // ! this set the fatal prop to true end the next toggle call will do anything
                                currentTest.status.end.toggle();
                            }
                            // console.log(currentTest.status);
                            // console.log(currentTest.status.dead.stack);
                            // console.log(currentTest.info.actualPath);
                        }
                    },
                    end: {
                        toggle() {
                            currentTest.status.end.isEnded = true;
                            if (currentTest.status.dead.isDead === true && innerConfig.exitOnError) {
                                process.exit(1);
                            }
                            // chack if all is ok and close the page stored in currentTest.attachedVar.page
                        },
                        isEnded: false
                    },
                    update(name) {
                        parentPort.postMessage(colors.yellow(`${name}  ==> `) + colors.blue(currentTendTestest.info.actualPath));
                    }
                },
                globalStats: {
                    incrNumOfExpect: function() {
                        currentTest.globalStats.numOfExpect = currentTest.globalStats.numOfExpect + 1;
                    },
                    incrNumOfEndExpect: function() {
                        currentTest.globalStats.numOfEndExpect = currentTest.globalStats.numOfEndExpect + 1;
                    },
                    incrNumOfWrap: function() {
                        currentTest.globalStats.numOfWrap = currentTest.globalStats.numOfWrap + 1;
                    },
                    incrNumOfEndWrap: function() {
                        currentTest.globalStats.numOfEndWrap = currentTest.globalStats.numOfEndWrap + 1;
                    },
                    numOfExpect: 0,
                    numOfEndExpect: 0,
                    numOfWrap: 0,
                    numOfEndWrap: 0
                },
                attachedVar: {
                    pagesExposeFunctionPromise: [],
                    page: await browser.newPage(),
                    import: {
                        testFile: {
                            _prop: new Set(), // this is a set that contain only _main test
                            has: function(test) {
                                currentTest.attachedVar.import.testFile._prop.has(test);
                            },
                            hasFromPath: function(path) {
                                Array.from(currentTest.attachedVar.import.testFile._prop).find(test => test.info.actualPath === path);
                            }
                        },
                        file: {
                            _prop: [] // this is an array of the path where the file are loaded (.js, .json) with is type ([{type: 'json', path: "d:/path/to/file"}])
                        },
                        from // this is an array of the testObject that as called this test
                    },
                    next: [], // next is the var that is send to the file that use this test as dependencies (it can be delived only is the test as finish loaded and started main),
                    ghost: {
                        isGhost: isGhost,
                        findMain: function() {
                            allTest._main.findPath(currentTest.info.actualPath);
                        },
                        findsGhost: function() {
                            allTest._ghost.findsPath(currentTest.info.actualPath);
                        }
                    }
                },
                info: {
                    fileName: _path.resolve(actualPath).split("\\").at(-1), //this is the filename
                    actualPath, // this is the actualPath where the .browser.test.js file is
                    uuid // this is the uuid of the test
                },
                log(dir, fileName, toLog, { type, mode }) {
                    const logFunc = function(mode) {
                        if (type === "append") {
                            fs.appendFileSync(_path.join("_" + dir, currentTest.info.fileName, mode, fileName), toLog + "\n");
                        } else {
                            fs.writeFileSync(_path.join("_" + dir, currentTest.info.fileName, mode, fileName), toLog);
                        }
                    };
                    if (innerConfig.log) {
                        if (mode === "error" && innerConfig.authorizedLog.includes("error")) {
                            logFunc("error");
                        } else if (mode === "log" && innerConfig.authorizedLog.includes("log")) {
                            logFunc("log");
                        } else if (mode === "debug" && innerConfig.authorizedLog.includes("debug")) {
                            logFunc("debug");
                        } else if (mode === "warn" && innerConfig.authorizedLog.includes("warn")) {
                            logFunc("warn");
                        } else if (mode === "info" && innerConfig.authorizedLog.includes("info")) {
                            logFunc("info");
                        }
                    }
                },
                promise: (() => {
                    let functionObj;
                    let prom = new Promise((res, rej) => (functionObj = { resolve: res, reject: rej })).then(function() {
                        currentTest.status.end.toggle();
                    });
                    Object.assign(prom, functionObj);
                    return prom;
                })()
            };
            return currentTest;
        },
        _main: {
            hasPath(path) {
                return Object.values(allTest._main._prop).some(t => {
                    return t.info.actualPath === path;
                });
            },
            findPath(path) {
                return Object.values(allTest._main._prop).find(t => t.info.actualPath === path);
            },
            has(c, type = "entries") {
                return Object[type](allTest._main._prop).some(c);
            },
            find(c, type = "entries") {
                return Object[type](allTest._main._prop).find(c);
            },
            getUuidFromPath(path) {
                return Object.entries(allTest._main._prop).find(([uuid, t]) => t.info.actualPath === path)[0];
            },
            getEntriesFromPath(path) {
                return Object.entries(allTest._main._prop).find(([uuid, t]) => t.info.actualPath === path);
            },
            _prop: {}
        },
        _ghost: {
            hasPath(path) {
                return Object.values(allTest._main).some(t => {
                    return t.info.actualPath === path;
                });
            },
            findsPath(path) {
                return Object.values(allTest._main).filter(t => t.info.actualPath === path);
            },
            has(c, type = "entries") {
                return Object[type](allTest._main).some(c);
            },
            finds(c, type = "entries") {
                return Object[type](allTest._main).filter(c);
            },
            getUuidsFromPath(path) {
                return Object.entries(allTest._main).filter(([uuid, t]) => t.info.actualPath === path).map(t => t[0]);
            },
            getEntriesFromPath(path) {
                return Object.entries(allTest._main).find(([uuid, t]) => t.info.actualPath === path);
            },
            _prop: {}
        }
    };

    const startGlobalTime = performance.now();

    const globalStats = {
        time: {
            startGlobalTime,
            endGlobalTime: undefined // it will be defined after
        },
        numOfEndTestFile: 0,
        numOfEndExpect: 0,
        numOfEndWrap: 0,
        numOfExpect: 0,
        numOfError: 0,
        numOfSucess: 0,
        numOfWrap: 0,
        numOfTestFile: filesPath.length + 1,
        numOfTest: 0 // the ammout of test (with the ghost)
    };

    async function newTest(actualPath, { ghost = false, from = [] } = {}) {
        console.log(actualPath);
        actualPath = pathNormalize(actualPath, "", "file");
        console.log(actualPath);

        let _r;
        if ((_r = allTest._main.findPath(actualPath)) && !ghost) {
            return _r;
        }

        globalStats.numOfTest = globalStats.numOfTest + 1;

        let pathModuleTest = transformPathWebToFile(actualPath.replace(".browser.test.js", ".js")).split("/");
        pathModuleTest[pathModuleTest.length - 1] = "/../" + pathModuleTest.at(-1);
        pathModuleTest = new URL(pathModuleTest.join("/")).href;

        const currentTest = ghost ? await allTest.createGhost(actualPath, from) : await allTest.createMain(actualPath, from);

        const page = currentTest.attachedVar.page;

        await page.setDefaultNavigationTimeout(0);
        await page.goto(`file://${pathToHtmlFile}?name=${_path.resolve(actualPath).split("\\").at(-1)}$path=${actualPath}&uuid=${currentTest.info.uuid}`);

        if (!currentTest.attachedVar.ghost.isGhost) {
            allTest.importedTest[actualPath] = [];
        }

        const pagesExposeFunctionPromise = currentTest.attachedVar.pagesExposeFunctionPromise; // this is an array
        pagesExposeFunctionPromise.push(
            page.exposeFunction("h0xtyueiifhbc_FileExist", path => {
                return fs.existsSync(path);
            })
        );

        pagesExposeFunctionPromise.push(
            page.exposeFunction("h0xtyueiifhbc_PathModuleTest", path => {
                throw new Error(path);
                currentTest.info.pathModuleTest = transformPathWebToFile(path);
            })
        );

        pagesExposeFunctionPromise.push(
            page.exposeFunction("h0xtyueiifhbc_Start", function() {
                currentTest.time.startTime = performance.now();
            })
        );

        pagesExposeFunctionPromise.push(
            page.exposeFunction("h0xtyueiifhbc_Log", function(message) {
                allTest.log(logDir, currentTest.info.uuid + ".log", message, { type: "append" });
            })
        );

        pagesExposeFunctionPromise.push(
            page.exposeFunction("h0xtyueiifhbc_ThrowError", function(error) {
                currentTest.status.dead.toggle("error", error, true);
                page.evaluate(() => {
                    window.h0xtyueiifhbc_EndOfFile();
                });
            })
        );

        pagesExposeFunctionPromise.push(
            page.exposeFunction("h0xtyueiifhbc_StartWrap", function() {
                currentTest.globalStats.incrNumOfWrap();
            })
        );

        pagesExposeFunctionPromise.push(
            page.exposeFunction("h0xtyueiifhbc_EndWrap", function() {
                currentTest.globalStats.incrNumOfEndWrap();
            })
        );

        pagesExposeFunctionPromise.push(
            page.exposeFunction("h0xtyueiifhbc_StartExpect", function() {
                currentTest.globalStats.incrNumOfExpect();
            })
        );

        pagesExposeFunctionPromise.push(
            page.exposeFunction("h0xtyueiifhbc_EndExpect", function() {
                currentTest.globalStats.incrNumOfEndExpect();
            })
        );

        pagesExposeFunctionPromise.push(
            page.exposeFunction("h0xtyueiifhbc_FailTest", function(message) {
                currentTest.log(errorDir, "fail.json", JSON.stringify(message, null, 4), { type: "append", mode: "fail" });
                currentTest.status.dead.toggle("fail", message, false);
            })
        );

        pagesExposeFunctionPromise.push(
            page.exposeFunction("h0xtyueiifhbc_GetAllFileInDir", path => {
                currentTest.status.update("start fetching directory");
                const ret = readdirSync(path).filter(function(_path) {
                    return !fs.statSync(_path).isDirectory();
                });
                currentTest.status.update("end fetching directory");
                return ret;
            })
        );

        pagesExposeFunctionPromise.push(page.exposeFunction("h0xtyueiifhbc_AddNextFromDepend", next => {
            console.log("next from depend")
            console.log(next)
            currentTest.attachedVar.next.push(...next);
        }));
        
        pagesExposeFunctionPromise.push(page.exposeFunction("h0xtyueiifhbc_AddNextFromUse", next => {
            console.log("next from use")
            console.log(next)
            currentTest.attachedVar.next.push(...next);
        }));

        pagesExposeFunctionPromise.push(
            page.exposeFunction("h0xtyueiifhbc_ImportTestDep", async testPath => {
                console.log("testPath  " + testPath);

                testPath = pathNormalize(currentTest.info.actualPath + "/../", testPath, "file");
                let test = allTest._main.findPath(testPath);
                
                console.log(test)

                if (currentTest.attachedVar.import.testFile.has(test)) {
                    return test.attachedVar.next;
                }

                if (currentTest.attachedVar.import.from.includes(test)) {
                    // this statement detect if the test is cyclic (if yes it return juste the path and a isOk to true to the browser so we don't reStart a new Test (it also say that this test is a ghost test))
                    return test.attachedVar.next;
                }

                if (!currentTest.attachedVar.ghost.isGhost) {
                    allTest.importedTest[actualPath].push(testPath);
                }

                if (hasCycle(allTest.importedTest, testPath)) {
                    if (test.isEnded) {
                        // ! this statement check if a ghost as already been called for this test (if yes we don't need to call it again)
                        return {
                            isOk: test.status.isOk(),
                            stack: test.status.dead.stack,
                            pathModuleTest: test.info.pathModuleTest
                        };
                    }
                    if (innerConfig.log && innerConfig.authorizedLog.includes("debug") && debugDir) {
                        fs.writeFileSync(_path.join(debugDir, "i.json"), JSON.stringify(test, null, 4));
                    }
                    // ! call newTest with ghost property to true
                    let res = await newTest(testPath, true, { ghost: true, importCyclic: [...currentTest.info.importCyclic, testPath] });
                    console.log(
                        colors.yellow("from => ") +
                            colors.blue(currentTest.info.actualPath) +
                            colors.yellow(" await ==> ") +
                            colors.blue(res.info.actualPath) +
                            colors.yellow("    ghost ==> ") +
                            (res.attachedVar.ghost.isGhost ? colors.green(res.attachedVar.ghost.isGhost) : colors.red(res.attachedVar.ghost.isGhost))
                    );
                    await res.promise;
                    console.log(
                        colors.yellow("from => ") +
                            colors.blue(currentTest.info.actualPath) +
                            colors.yellow(" end await ==> ") +
                            colors.blue(res.info.actualPath) +
                            colors.yellow("    ghost ==> ") +
                            (res.attachedVar.ghost.isGhost ? colors.green(res.attachedVar.ghost.isGhost) : colors.red(res.attachedVar.ghost.isGhost))
                    );
                    return {
                        isOk: res.status.isOk(),
                        stack: test.status.dead.stack,
                        pathModuleTest: test.info.pathModuleTest
                    };
                }

                if (!test) {
                    let res;
                    let prom = new Promise(r => {
                        res = r;
                    });
                    setTimeout(async () => {
                        test = await newTest(testPath, true);
                        if (innerConfig.log && innerConfig.authorizedLog.includes("error")) {
                            allTest.log(errorDir, testPath.split("/").at(-1).replace(".browser.test.js", ".js"), JSON.stringify(test, null, 4), { type: "append" }); // ! rewrite this code
                        }
                        res();
                    }, innerConfig.timeToAwaitBetweenEachTest);

                    await prom;
                }

                console.log(
                    colors.yellow("from => ") +
                        colors.blue(currentTest.info.actualPath) +
                        colors.yellow(" await ==> ") +
                        colors.blue(test.info.actualPath) +
                        colors.yellow("    ghost ==> ") +
                        (test.attachedVar.ghost.isGhost ? colors.green(test.attachedVar.ghost.isGhost) : colors.red(test.attachedVar.ghost.isGhost))
                );
                await test.promise;
                console.log(
                    colors.yellow("from => ") +
                        colors.blue(currentTest.info.actualPath) +
                        colors.yellow(" end await ==> ") +
                        colors.blue(test.info.actualPath) +
                        colors.yellow("    ghost ==> ") +
                        (test.attachedVar.ghost.isGhost ? colors.green(test.attachedVar.ghost.isGhost) : colors.red(test.attachedVar.ghost.isGhost))
                );

                return test.attachedVar.next;
            })
        );

        pagesExposeFunctionPromise.push(
            page.exposeFunction("h0xtyueiifhbc_EndOfFile", mainWrapJson => {
                console.log(
                    colors.yellow("end of file ==> ") +
                        colors.blue(currentTest.info.actualPath) +
                        colors.yellow("    ghost ==> ") +
                        (currentTest.attachedVar.ghost.isGhost ? colors.green(currentTest.attachedVar.ghost.isGhost) : colors.red(currentTest.attachedVar.ghost.isGhost))
                );
                // if (innerConfig.env === "debug") {
                //     fs.writeFileSync(_path.join(errorDir, `${globalStats.numOfEndTestFile}.json`), JSON.stringify({ path, pathModuleTest, stack, mainWrapJson }, null, 4));
                // }

                // fs.writeFileSync(_path.join(errorDir, `${globalStats.numOfEndTestFile}.json`), JSON.stringify({ path, pathModuleTest, errorStack, mainWrapJson }, null, 4));

                // ms to s
                const time = (performance.now() - currentTest.time.startTime) / 1000;
                currentTest.time.endTime = performance.now();

                // fs.writeFileSync("mainWrap.json", mainWrapJson);
                (async function() {
                    if (currentTest.status.dead.isDead === "error") {
                        // ! this function don't work perfectly (it handle a string and it's not the best solution)
                        let lastPath;
                        // // fs.writeFileSync(_path.join(errorDir, `stack.${globalStats.numOfEndTestFile}.txt`), JSON.stringify({ h0xtyueiifhbc: path, ...errorStack }, null, 4));
                        // return;
                        // if (typeof errorStack != "string") {
                        //     fs.writeFileSync(_path.join(errorDir, `${uuid}.txt`), path);
                        // }
                        // let line = errorStack.split("\n")[0];
                        // if (line.startsWith("Error: the testModule ")) {
                        //     lastPath = line.split("Error: the testModule ")[1].split(" handle a fail")[0];
                        // } else if (line.startsWith("Error: import ")) {
                        //     lastPath = line.split("Error: import ")[1].split(" failed")[0];
                        // } else if (line.startsWith("the testModule ")) {
                        //     lastPath = line.split("the testModule ")[1].split(" handle a fail")[0];
                        // } else if (line.startsWith("import ")) {
                        //     lastPath = line.split("import ")[1].split(" failed")[0];
                        // } else {
                        //     lastPath = transformPathWebToFile(errorStack.split("\n").at(-1).split("at ")[1]).split(":").slice(0, 2).join(":");
                        // }
                        // let uuidT = typeof lastPath == "string" ? (await loadedPromise[transformPathWebToFile(lastPath)]) ? .uuid : undefined;
                        // fs.writeFileSync(
                        //     _path.join(errorDir, `${uuid}.txt`),
                        //     path + "\n\n\n" + errorStack + "\n\n\n" + (uuidT !== uuid ? (uuidT ? "last error log file " + transformPathFileToWeb(errorDir + "/" + uuidT) + ".txt" : lastPath) : "")
                        // );
                    } else if (currentTest.status.dead.isDead === "fail") {
                    } else {
                        //                         // is Dead is false
                        //                         const dictError = new Map();
                        //                         function rec(p, stack) {
                        //                             if (p.childs) {
                        //                                 p.childs.forEach(c => {
                        //                                     rec(c, [...stack, p]);
                        //                                 });
                        //                             }
                        //                             if (p.directTests) {
                        //                                 p.directTests.forEach(c => {
                        //                                     if (c.status === "fail") {
                        //                                         if (!dictError.has([...stack, p].map(s => (s.descriptor ? `${s.name} : ${s.descriptor}` : s.name)).join(" > "))) {
                        //                                             dictError.set([...stack, p].map(s => (s.descriptor ? `${s.name} : ${s.descriptor}` : s.name)).join(" > "), []);
                        //                                         }
                        //                                         dictError.get([...stack, p].map(s => (s.descriptor ? `${s.name} : ${s.descriptor}` : s.name)).join(" > ")).push(c);
                        //                                     }
                        //                                 });
                        //                             }
                        //                         }
                        //                         rec(uncycle(JSON.parse(mainWrapJson)), []);
                        //                         let string = "";
                        //                         dictError.forEach((v, k) => {
                        //                             v.forEach(t => {
                        //                                 const ct = cycle(t);
                        //                                 delete ct.parent;
                        //                                 string += `${k} =>
                        // ${JSON.stringify(ct, null, 4)}
                        // `;
                        //                             });
                        //                         });
                        //                         if (innerConfig.log && innerConfig.authorizedLog.includes("error")) {
                        //                             fs.writeFileSync(_path.join(errorDir, `${actualPath.replace(/\\/g, ".").replace(/\//g, ".").replace(/:/g, "_")}.mainWrapJson.json`), mainWrapJson);
                        //                         }
                        //                         if (innerConfig.log && innerConfig.authorizedLog.includes("error")) {
                        //                             if (string !== "") {
                        //                                 fs.writeFileSync(_path.join(errorDir, `${loadedProp[actualPath].uuid}.txt`), actualPath + "\n\n\n" + string);
                        //                             }
                        //                         }
                    }
                })();

                if (innerConfig.log && innerConfig.authorizedLog.includes("debug") && !currentTest.status.isOk()) {
                    fs.writeFileSync(_path.join(debugDir, `stack.${globalStats.numOfEndTestFile}.txt`), currentTest.status.stack ? JSON.stringify({ file: actualPath, stack }, null, 4) : "undefined");
                }

                currentTest.status.end.toggle();

                // if (currentTest.attachedVar.ghost.isGhost && innerConfig.displayGhost) {
                //     multibar.remove(b);
                //     activeBar.delete(b);
                // }

                // if (!currentTest.attachedVar.ghost.isGhost || innerConfig.displayGhost) {
                //     if (isDead === false) {
                //         b.status = colors.white.bgGreen("success");
                //     } else if (isDead === "error") {
                //         b.status = colors.white.bgRed(stack.name); //stack is an error stack
                //     } else if (isDead === "fail") {
                //         b.status = colors.white.bgRed("TestFail"); // stack is an array of failed tests
                //     } else {
                //         b.status = colors.white.bgRed("error");
                //     }
                //     updateStatus({ status: b.status, time: `${time > 10 ? colors.red(`${time.toFixed(2)} s`) : colors.magenta(`${time.toFixed(time < 2 ? 3 : time < 1 ? 4 : 2)} s`)}` });

                //     multibar.update();

                //     for (const bar of activeBar) {
                //         updateStatus({ bar: bar });
                //     }

                //     b.isOk = isDead === false;
                //     b.isEnded = true;
                // }

                if (!currentTest.attachedVar.ghost.isGhost) {
                    if (currentTest.status.isOk()) {
                        globalStats.numOfSucess = globalStats.numOfSucess + 1;
                    } else {
                        globalStats.numOfError = globalStats.numOfError + 1;
                    }
                    globalStats.numOfExpect = currentTest.globalStats.numOfExpect + globalStats.numOfExpect;
                    globalStats.numOfEndExpect = currentTest.globalStats.numOfEndExpect + globalStats.numOfEndExpect;
                    globalStats.numOfWrap = globalStats.numOfWrap + currentTest.globalStats.numOfWrap;
                    globalStats.numOfEndWrap = globalStats.numOfEndWrap + currentTest.globalStats.numOfEndWrap;
                    globalStats.numOfEndTestFile = globalStats.numOfEndTestFile + 1;

                    // cursor
                    //     .savePosition()
                    //     .goto(0, 0)
                    //     .write(
                    //         colors.green("start") +
                    //             "   " +
                    //             colors.yellow(globalStats.numOfEndTestFile + "/" + (filesPath.length + 1)) +
                    //             " " +
                    //             (filesPath.length + 1 > 1 ? "files" : "file") +
                    //             "      " +
                    //             (displayGhostWithMultipleTestAtTheSameTime
                    //                 ? colors.yellow("WARN :") + " " + colors.red("the display ghost can't be enable when multiple test at the same time is enabled")
                    //                 : "")
                    //     )
                    //     .restorePosition();
                }

                console.log(
                    colors.yellow("resolve ==>  ") +
                        colors.blue(currentTest.info.actualPath) +
                        colors.yellow("    ghost ==> ") +
                        (currentTest.attachedVar.ghost.isGhost ? colors.green(currentTest.attachedVar.ghost.isGhost) : colors.red(currentTest.attachedVar.ghost.isGhost))
                );
                currentTest.promise.resolve(currentTest);

                if (innerConfig.screen.state) {
                    if (from.length === 0 && !currentTest.attachedVar.ghost.isGhost) {
                        nextQueue();
                    }
                    if (innerConfig.log && innerConfig.authorizedLog.includes("error")) {
                        // fs.writeFileSync(_path.join(errorDir, `errorStack.${globalStats.numOfEndTestFile}.json`), JSON.stringify({ actualPath, stack, isOk: isDead === false, isDead }, null, 4));
                    }
                    if (currentTest.attachedVar.ghost.isGhost) {
                        page.close();
                    } else if (innerConfig.screen.state === true && innerConfig.screen.clearOnSucess && currentTest.status.isOk()) {
                        page.close();
                    }
                } else {
                    page.close().then(() => {
                        if (from.length === 0 && !currentTest.attachedVar.ghost.isGhost) {
                            nextQueue();
                        }
                        if (innerConfig.log && innerConfig.authorizedLog.includes("error")) {
                            // fs.writeFileSync(_path.join(errorDir, `errorStack.${globalStats.numOfEndTestFile}.json`), JSON.stringify({ actualPath, stack, isOk: isDead === false, isDead }, null, 4));
                        }
                    });
                }
            })
        );

        await Promise.all(pagesExposeFunctionPromise);

        page.setContent(
            `<script type="module">${fs.readFileSync(pathToClientJsFile, "utf8").replace(/h0xtyueiifhbcChange/g, `"${actualPath}"`)}</script><title>${_path
                .resolve(actualPath)
                .split("\\")
                .at(-1)}</title>`
        );
        return currentTest;
    }

    let queue = [];

    let InHandle = 0;

    function endProcess() {
        // for (const bar of activeBar) {
        //     multibar.remove(bar);
        // }

        // console.log(testImport);

        // console.log(loadedPromise);

        // if (innerConfig.log && innerConfig.authorizedLog.includes("debug")) {
        //     fs.writeFileSync(_path.join(debugDir, `loadedPromise.txt`), JSON.stringify(loadedPromise, null, 4));
        // }

        // if (innerConfig.log && innerConfig.authorizedLog.includes("debug")) {
        //     fs.writeFileSync(_path.join(debugDir, `loadedPromise.json`), JSON.stringify(loadedPromise, null, 4));
        //     fs.writeFileSync(_path.join(debugDir, `testImport.json`), JSON.stringify(testImport, null, 4));
        //     fs.writeFileSync(_path.join(debugDir, `loadedProp.json`), JSON.stringify(loadedProp, null, 4));
        // }

        // if (innerConfig.bar.state && innerConfig.bar.clearOnSucess) {
        //     for (const bar of Array.from(activeBar).reverse()) {
        //         if (bar.isEnded && bar.isOk) {
        //             bar.stop();
        //             multibar.remove(bar);
        //             activeBar.delete(bar);
        //             barRemoved = true;
        //         }
        //     }
        // }

        // const deadBar = [];
        // const restBar = [];

        // for (const bar of Array.from(activeBar)) {
        //     bar.stop();
        //     multibar.remove(bar);
        //     if (bar.isOk) {
        //         restBar.push(bar);
        //     } else {
        //         deadBar.push(bar);
        //     }
        //     activeBar.delete(bar);
        // }

        // for (const bar of Array.from(deadBar)) {
        //     multibar.create(bar.getTotal(), bar.value, bar);
        // }

        // for (const bar of Array.from(restBar)) {
        //     multibar.create(bar.getTotal(), bar.value, bar);
        // }

        // multibar.stop();

        globalStats.time.endGlobalTime = performance.now() - startGlobalTime;

        // cursor.savePosition().goto(process.stdout.columns - `${(endTime / 1000).toFixed(2)} s`.length, 0).write(colors.blue(`${(endTime / 1000).toFixed(2)} s`)).restorePosition();

        // console.log("\n" + colors.blue("a complete log of the error can be found in " + innerConfig.outDir.path) + "\n");

        // console.log(globalStats);

        // parentPort.postMessage({ type: "end process", data: { allTest, globalStats } });
        parentPort.postMessage({ type: "end process" });

        // parentPort.postMessage({ ...globalStats, importFileFromItSelf: undefined });

        // parentPort.postMessage(JSON.stringify(allTest, null, 4))

        parentPort.postMessage({ ...globalStats });

        if (!innerConfig.screen.state) {
            browser.close();
            process.exit(0);
        } else {
            if (innerConfig.screen.state === true && innerConfig.screen.closeOnAllSuccess && globalStats.numOfError === 0) {
                browser.close();
                process.exit(0);
            }
        }
    }

    function addQueue(path) {
        queue.push(path);
    }

    function nextQueue() {
        if (queue.length > 0) {
            InHandle++;
            let path = queue.shift();
            if (allTest._main.hasPath(path)) {
                InHandle--;
                nextQueue();
                if (InHandle === 0 && queue.length === 0) {
                    endProcess();
                }
                return;
            }
            setTimeout(function() {
                /** ! insert allTest[uuid] =  here */
                newTest(path).then(r => r.promise).then(r => {
                    InHandle--;
                    // console.log({ ...globalStats, importFileFromItSelf: undefined });
                    if (InHandle === 0 && queue.length === 0) {
                        endProcess();
                    }
                });
            }, innerConfig.timeToAwaitBetweenEachTest);
        }
    }

    infoMessager("queu implementation ...");

    filesPath.forEach(file => {
        addQueue(transformPathWebToFile(file));
    });

    for (let i = 0; i < innerConfig.NumberOfTestAtTheSameTime; i++) {
        nextQueue();
    }
})(workerData);
