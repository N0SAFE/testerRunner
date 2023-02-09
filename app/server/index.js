const fs = require("fs");
// const {MultiProgressBars} = require("multi-progress-bars");
const colors = require("colors");
const _path = require("path");
const loadingCli = require("loading-cli");
// const typeVerifModule = require('./util/client/typeVerification.js')
const ansi = require("ansi"),
    cursor = ansi(process.stdout);
const {
    isArray,
    isObject,
    isBoolean,
    isNumber
} = require('./function.js')
const { Worker, isMainThread, parentPort, workerData } = require("node:worker_threads");

const argv = process.argv[2] && process.argv[2].startsWith("--") ? process.argv.slice(1) : process.argv.slice(2);

let p;
if (process.argv[2]) {
    if (process.argv[2].startsWith("--")) {
        p = process.cwd();
    } else {
        p = process.argv[2];
        // verify if p is a valid path
        if (!fs.existsSync(p)) {
            console.log(colors.red(`The path "${p}" does not exist`));
            process.exit(1);
        }
        p = _path.resolve(p);
    }
} else {
    p = process.cwd();
}

const { loadSpinnerStop, loadSpinnerChangeText } = (() => {
    let spinner = loadingCli({
        // text: colors.yellow("starting..."),
        color: "yellow",
        interval: 100,
        stream: process.stdout,
        frames: [
            "⢀⠀",
            "⡀⠀",
            "⠄⠀",
            "⢂⠀",
            "⡂⠀",
            "⠅⠀",
            "⢃⠀",
            "⡃⠀",
            "⠍⠀",
            "⢋⠀",
            "⡋⠀",
            "⠍⠁",
            "⢋⠁",
            "⡋⠁",
            "⠍⠉",
            "⠋⠉",
            "⠋⠉",
            "⠉⠙",
            "⠉⠙",
            "⠉⠩",
            "⠈⢙",
            "⠈⡙",
            "⢈⠩",
            "⡀⢙",
            "⠄⡙",
            "⢂⠩",
            "⡂⢘",
            "⠅⡘",
            "⢃⠨",
            "⡃⢐",
            "⠍⡐",
            "⢋⠠",
            "⡋⢀",
            "⠍⡁",
            "⢋⠁",
            "⡋⠁",
            "⠍⠉",
            "⠋⠉",
            "⠋⠉",
            "⠉⠙",
            "⠉⠙",
            "⠉⠩",
            "⠈⢙",
            "⠈⡙",
            "⠈⠩",
            "⠀⢙",
            "⠀⡙",
            "⠀⠩",
            "⠀⢘",
            "⠀⡘",
            "⠀⠨",
            "⠀⢐",
            "⠀⡐",
            "⠀⠠",
            "⠀⢀",
            "⠀⡀"
        ]
    });
    spinner.start();

    function spinnerStop() {
        spinner.stop();
    }
    function spinnerChnageText(text) {
        spinner.text = text;
    }

    return {
        loadSpinnerStop: spinnerStop,
        loadSpinnerChangeText: spinnerChnageText
    };
})();

process.stdout.write(colors.yellow("Starting browser test and search file..."));
loadSpinnerChangeText(colors.yellow("generating config"));

const innerConfig = {
    toAvoid: [],
    pathTest: p,
    outDir: {},
    NumberOfTestAtTheSameTime: 1,
    screen: {
        state: false
    },
    bar: {
        state: true
    }
}

function parseConf(conf) {
    innerConfig.log = isBoolean(conf.log) ? conf.log : false;
    innerConfig.authorizedLog = isArray(conf.authorizedLog) ? conf.authorizedLog : ["log", "error", "debug"];
    innerConfig.screen = isObject(conf.screen) ? conf.screen : innerConfig.screen;
    innerConfig.screen.state = isBoolean(conf.screen?.state) ? conf.screen.state : innerConfig.screen.state;
    innerConfig.timeToAwaitBetweenEachTest = isNumber(conf.timeToAwaitBetweenEachTest) ? conf.timeToAwaitBetweenEachTest : 0;
    innerConfig.bar = isObject(conf.bar) ? conf.bar : innerConfig.bar;
    innerConfig.bar.state = isBoolean(conf.bar?.state) ? conf.bar.state : innerConfig.bar.state;

    if (conf.toAvoid) {
        innerConfig.toAvoid.push(...conf.toAvoid);
    } else {
        innerConfig.toAvoid.push("node_modules");
    }

    if (conf.outDir) {
        innerConfig.outDir.path = conf.outDir.path || "assetsBrowserTest/";
        innerConfig.outDir.clean = conf.outDir.clean || true;
    } else {
        innerConfig.outDir.path = "assetsBrowserTest/";
        innerConfig.outDir.clean = true;
    }
    
    innerConfig.outDir.path = _path.join(innerConfig.pathTest, innerConfig.outDir.path)

    if (conf.NumberOfTestAtTheSameTime) {
        innerConfig.NumberOfTestAtTheSameTime = (conf.NumberOfTestAtTheSameTime > 0 ? conf.NumberOfTestAtTheSameTime : 1) | 0; // ! | 0 is to convert to int if the value is a float
    }

    if (conf.log && conf.authorizedLog.length > 0) {
        if (innerConfig.outDir.clean) {
            if (fs.existsSync(innerConfig.outDir.path)) {
                if (innerConfig.outDir.path === _path.join(innerConfig.pathTest + "/")) {
                    console.log(colors.red("You can't clean the current directory"));
                    console.log("");
                    console.log(colors.red("Please change the outDir.path in your .browser.test.conf.js or disable the clean option (outDir.clean: false)"));
                    process.exit(1);
                } else if (!innerConfig.outDir.path.includes(_path.join(innerConfig.pathTest + "/"))) {
                    console.log(colors.red("You can't clean a directory outside of the current directory"));
                    console.log("");
                    console.log(colors.red("Please change the outDir.path in your .browser.test.conf.js or disable the clean option (outDir.clean: false)"));
                    process.exit(1);
                }
                fs.rmSync(innerConfig.outDir.path, { recursive: true, force: true });
            }
        }

        if (conf.outDir.type.log && conf.authorizedLog.includes("log")) {
            // replace all {{}} by the value of the var

            const outLogPath = _path.join(conf.outDir.path, conf.outDir.type.log);

            if (!fs.existsSync(outLogPath)) {
                fs.mkdirSync(outLogPath, { recursive: true });
            }

            innerConfig.outDir.log = outLogPath;
        } else {
            innerConfig.outDir.log = false;
        }

        if (conf.outDir.type.error && conf.authorizedLog.includes("error")) {
            // replace all {{}} by the value of the var

            const outErrorPath = _path.join(conf.outDir.path, conf.outDir.type.error);

            if (!fs.existsSync(outErrorPath)) {
                fs.mkdirSync(outErrorPath, { recursive: true });
            }

            innerConfig.outDir.error = outErrorPath;
        }

        if (conf.outDir.type.debug && conf.authorizedLog.includes("debug")) {
            // replace all {{}} by the value of the var

            const outDebugPath = _path.join(conf.outDir.path, conf.outDir.type.debug);

            if (!fs.existsSync(outDebugPath)) {
                fs.mkdirSync(outDebugPath, { recursive: true });
            }

            innerConfig.outDir.debug = outDebugPath;
        }
    }

    if (conf.redirect) {
        innerConfig.pathTest = _path.join(innerConfig.pathTest, conf.redirect);
    }
    
    if(conf.exitOnError !== undefined){
        innerConfig.exitOnError = conf.exitOnError
    }else{
        innerConfig.exitOnError = true
    }

    innerConfig.displayGhost = conf.displayGhost || false;
}

if (fs.existsSync(_path.join(innerConfig.pathTest, ".browser.test.conf.local.js"))) {
    parseConf(require(_path.join(innerConfig.pathTest, ".browser.test.conf.local.js")));
}else if (fs.existsSync(_path.join(innerConfig.pathTest, ".browser.test.conf.js"))) {
    parseConf(require(_path.join(innerConfig.pathTest, ".browser.test.conf.js")));
}else{
    parseConf(require(_path.join(__dirname, "../../config/.browser.test.conf.default.js")));
}

loadSpinnerChangeText(colors.yellow("check path"));

if (!fs.existsSync(innerConfig.pathTest)) {
    console.log("path not found");
    process.exit(1);
}

if (fs.statSync(innerConfig.pathTest).isFile() && !innerConfig.pathTest.endsWith("browser.test.js")) {
    console.log("path is not a browser.test.js file or a directory");
    process.exit(1);
}

loadSpinnerChangeText(colors.yellow("get all browser.test.js files"));

let filesPath;

const errorDir = innerConfig.outDir.error;
const logDir = innerConfig.outDir.log;
const debugDir = innerConfig.outDir.debug;

const displayGhostWithMultipleTestAtTheSameTime = innerConfig.displayGhost && innerConfig.NumberOfTestAtTheSameTime > 1;
if (displayGhostWithMultipleTestAtTheSameTime) {
    innerConfig.displayGhost = false;
}

if (fs.lstatSync(innerConfig.pathTest).isFile()) {
    if (innerConfig.pathTest.endsWith(".browser.test.js")) {
        filesPath = [innerConfig.pathTest.replace(/\\/g, "/")];
    } else {
        throw new Error("the path have to be a directory or a *.browser.test.js file");
    }
} else {
    filesPath = ((toAvoid, pathTest) => {
        if (!fs.lstatSync(pathTest).isDirectory()) {
            return [pathTest];
        } else {
            // detect all file in sub folder that end with broser.test.js
            const filesPath = [];

            function rec(pathTest) {
                const files = fs.readdirSync(pathTest);
                for (const file of files) {
                    const filePath = _path.join(pathTest, file);
                    if (fs.statSync(filePath).isDirectory()) {
                        if (toAvoid.includes(file)) continue;
                        rec(filePath);
                    } else if (file.endsWith(".browser.test.js")) {
                        filesPath.push(filePath.replace(/\\/g, "/"));
                    }
                }
            }

            rec(pathTest);

            return filesPath;
        }
    })(innerConfig.toAvoid, innerConfig.pathTest);
}

loadSpinnerChangeText(colors.green("starting..."));
// stop here

(async t => {
    const listTestLinkBar = []
    
    
    
    
    function incrementExpect(b) {
        const actualTime = performance.now() - startGlobalTime;
        cursor.savePosition().goto(process.stdout.columns - `${(actualTime / 1000).toFixed(2)} s`.length, 0).write(colors.blue(`${(actualTime / 1000).toFixed(2)} s`)).restorePosition();
        b.numOfExpect = b.numOfExpect + 1;
    }
    function incrementEndExpect(b) {
        const actualTime = performance.now() - startGlobalTime;
        cursor.savePosition().goto(process.stdout.columns - `${(actualTime / 1000).toFixed(2)} s`.length, 0).write(colors.blue(`${(actualTime / 1000).toFixed(2)} s`)).restorePosition();
        b.numOfEndExpect = b.numOfEndExpect + 1;
    }

    function updateStatus(b, { status, time }) {
        const actualTime = performance.now() - startGlobalTime;
        cursor.savePosition().goto(process.stdout.columns - `${(actualTime / 1000).toFixed(2)} s`.length, 0).write(colors.blue(`${(actualTime / 1000).toFixed(2)} s`)).restorePosition();
        if (b) {
            if (status) {
                if (ghost) {
                    b.status = colors.bgBlack.grey("ghost");
                } else {
                    b.status = status;
                }
            }

            if (time) {
                b.time = time;
            }

            b.update(b.value, {
                status: `expect: ${b.numOfEndExpect}/${b.numOfExpect} | ${b.status} ${b.time ? `| ${b.time}` : ""}`
            });
        }
    }
});

loadSpinnerStop()

const worker = new Worker(__dirname + "/runner.js", {
    workerData: {filesPath, innerConfig, displayGhostWithMultipleTestAtTheSameTime, dir: {debugDir, errorDir, logDir}}
});

if(!isMainThread){
    worker.on("message", function (o) {
        console.log("message ")
        console.log(o)
    });
} else {
    worker.on("message", function (o) {
        console.log("message ")
        console.log(o)
    });
}

worker.on("error", function (o) {
    console.log("an error occure :")
    console.log(o)
    
});

worker.on("exit", code => {
    console.log("exit")
    console.log(code)
    process.exit(code);
});






// (async filesPath => {
//     console.clear();

//     const browser = await puppeteer.launch({
//         headless: !innerConfig.screen.state,
//         devtools: true,
//         args: ["--disable-web-security", "--disable-features=IsolateOrigins", "--disable-site-isolation-trials"]
//     });

//     let startingPage = await browser.newPage();
//     await startingPage.goto("about:blank");
//     await startingPage.close();

//     loadSpinnerStop();
//     console.log(
//         colors.green("start") +
//             "   " +
//             colors.yellow("0/" + (filesPath.length + 1)) +
//             " " +
//             (filesPath.length + 1 > 1 ? "files" : "file") +
//             "      " +
//             (displayGhostWithMultipleTestAtTheSameTime ? colors.yellow("WARN :") + " " + colors.red("the display ghost can't be enable when multiple test at the same time is enabled") : "")
//     );
//     console.log();

//     const multibar = new cliProgress.MultiBar(
//         {
//             hideCursor: true,
//             stopOnComplete: false,
//             emptyOnZero: true,
//             format: colors.cyan("{bar}") + "| {percentage}% || {value}/{total} Wraps | {file} | {status}"
//         },
//         cliProgress.Presets.shades_grey
//     );

//     /**
//     * @type {Set<cliProgress.SingleBar>}
//     */
//     const activeBar = new Set();

//     const loadedPromise = {};
//     const loadedProp = {};
//     const testImport = {};

//     const startGlobalTime = performance.now();
    
//     const stats = {
//         numOfEndTestFile: 0,
//         numOfEndExpect: 0,
//         numOfEndWrap: 0,
//         numOfExpect: 0,
//         numOfError: 0,
//         numOfSucess: 0,
//         numOfWrap: 0,
//         numOfTestFile: filesPath.length + 1
//     }

//     async function newTest(actualPath, isImported, { ghost = false, importCyclic = [] } = {}) {
//         const actualTime = performance.now() - startGlobalTime;
//         cursor.savePosition().goto(process.stdout.columns - `${(actualTime / 1000).toFixed(2)} s`.length, 0).write(colors.blue(`${(actualTime / 1000).toFixed(2)} s`)).restorePosition();
//         if (loadedPromise[actualPath] && !ghost) {
//             return loadedPromise[actualPath];
//         }

//         function incrementExpect(b) {
//             const actualTime = performance.now() - startGlobalTime;
//             cursor.savePosition().goto(process.stdout.columns - `${(actualTime / 1000).toFixed(2)} s`.length, 0).write(colors.blue(`${(actualTime / 1000).toFixed(2)} s`)).restorePosition();
//             b.numOfExpect = b.numOfExpect + 1;
//         }
//         function incrementEndExpect(b) {
//             const actualTime = performance.now() - startGlobalTime;
//             cursor.savePosition().goto(process.stdout.columns - `${(actualTime / 1000).toFixed(2)} s`.length, 0).write(colors.blue(`${(actualTime / 1000).toFixed(2)} s`)).restorePosition();
//             b.numOfEndExpect = b.numOfEndExpect + 1;
//         }
    
//         function updateStatus(b, { status, time }) {
//             const actualTime = performance.now() - startGlobalTime;
//             cursor.savePosition().goto(process.stdout.columns - `${(actualTime / 1000).toFixed(2)} s`.length, 0).write(colors.blue(`${(actualTime / 1000).toFixed(2)} s`)).restorePosition();
//             if (b) {
//                 if (status) {
//                     if (ghost) {
//                         b.status = colors.bgBlack.grey("ghost");
//                     } else {
//                         b.status = status;
//                     }
//                 }
    
//                 if (time) {
//                     b.time = time;
//                 }
    
//                 b.update(b.value, {
//                     status: `expect: ${b.numOfEndExpect}/${b.numOfExpect} | ${b.status} ${b.time ? `| ${b.time}` : ""}`
//                 });
//             }
//         }

//         if (!ghost) {
//             testImport[actualPath] = [];
//             loadedProp[actualPath] = {
//                 isEnded: false,
//                 uuid: randomUUID()
//             };
//         }

//         // if (innerConfig.log && innerConfig.authorizedLog.includes("debug")) {
//         //     fs.writeFileSync(_path.join(debugDir, `${i++}`), actualPath);
//         // }

//         let startTime;
//         let isDead = false;
//         let status = ghost ? colors.bgBlack.grey("ghost") : colors.white.bgYellow("starting");
//         let errorStack;
//         let failStack = [];

//         let b;
        
//         if (innerConfig.bar.state && innerConfig.bar.clearOnSucess){
//             for (const bar of Array.from(activeBar).reverse()) {
//                 if (bar.isEnded && bar.isOk) {
//                     bar.stop();
//                     multibar.remove(bar);
//                     activeBar.delete(bar);
//                     barRemoved = true;
                    
//                 }
//             }
//         }

//         if (!ghost || innerConfig.displayGhost) {
//             if (activeBar.size > process.stdout.rows - 7) {
//                 let barRemoved = false;
//                 for (const bar of Array.from(activeBar).reverse()) {
//                     if (bar.isEnded && bar.isOk) {
//                         bar.stop();
//                         multibar.remove(bar);
//                         activeBar.delete(bar);
//                         barRemoved = true;
//                         break;
//                     }
//                 }
//                 if (!barRemoved) {
//                     if (activeBar.size > 0) {
//                         const b = activeBar.values().next().value;
//                         b.stop();
//                         multibar.remove(b);
//                         activeBar.delete(b);
//                     }
//                 }
//                 if (innerConfig.bar.state && innerConfig.bar.clearOnSucess && isDead === false) {
//                     for (const bar of Array.from(activeBar).reverse()) {
//                         if (bar.isEnded && bar.isOk) {
//                             bar.stop();
//                             multibar.remove(bar);
//                             activeBar.delete(bar);
//                             barRemoved = true;
//                             break;
//                         }
//                     }
//                 }
//             }

//             b = multibar.create(0, 0, {
//                 file: _path.resolve(actualPath).split("\\").at(-1),
//                 status
//             });
            
//             b.file = _path.resolve(actualPath).split("\\").at(-1)
//             b.isEnded = false;
//             b.isOk = false;
//             b.status = status;
//             b.numOfExpect = 0;
//             b.numOfEndExpect = 0;

//             activeBar.add(b);
//         }

//         const temp = {};
//         const numberOfTestsPromise = new Promise((res, rej) => {
//             temp.res = res;
//             temp.rej = rej;
//         });

//         numberOfTestsPromise.res = temp.res;
//         numberOfTestsPromise.rej = temp.rej;

//         const page = await browser.newPage();
//         await page.goto(`file://${__dirname}/../test.html?name=${_path.resolve(actualPath).split("\\").at(-1)}$path=${actualPath}&uuid=${loadedProp[actualPath].uuid}`);

//         const pagesExposeFunctionPromise = [];

//         pagesExposeFunctionPromise.push(
//             page.exposeFunction("h0xtyueiifhbc_FileExist", path => {
//                 return fs.existsSync(path);
//             })
//         );

//         let pathModuleTest = transformPathWebToFile(actualPath.replace(".browser.test.js", ".js"));
//         pathModuleTest = pathModuleTest.split("/");
//         pathModuleTest[pathModuleTest.length - 1] = "/../" + pathModuleTest.at(-1);
//         pathModuleTest = pathModuleTest.join("/");
//         loadedProp[actualPath].pathModuleTest = new URL(pathModuleTest).href;
//         pagesExposeFunctionPromise.push(
//             page.exposeFunction("h0xtyueiifhbc_PathModuleTest", path => {
//                 loadedProp[actualPath].pathModuleTest = transformPathWebToFile(path);
//             })
//         );

//         pagesExposeFunctionPromise.push(
//             page.exposeFunction("h0xtyueiifhbc_Start", function() {
//                 errorStack;
//                 startTime = performance.now();
//                 if (!ghost || innerConfig.displayGhost) {
//                     b.status = colors.white.bgYellow("running");
//                     updateStatus({ status: b.status });
//                 }
//             })
//         );

//         pagesExposeFunctionPromise.push(
//             page.exposeFunction("h0xtyueiifhbc_Log", function(fileName, message) {
//                 if (innerConfig.log && innerConfig.authorizedLog.includes("log")) {
//                     fs.writeFileSync(_path.join(logDir, "fileName"), message);
//                 }
//             })
//         );

//         pagesExposeFunctionPromise.push(
//             page.exposeFunction("h0xtyueiifhbc_ThrowError", function(error) {
//                 isDead = "error";
//                 if (!ghost || innerConfig.displayGhost) {
//                     b.status = colors.white.bgRed("running");
//                     updateStatus({ status: b.status });
//                 }

//                 errorStack = error;
//                 page.evaluate(() => {
//                     window.h0xtyueiifhbc_EndOfFile();
//                 });
//             })
//         );

//         pagesExposeFunctionPromise.push(
//             page.exposeFunction("h0xtyueiifhbc_StartWrap", function() {
//                 if (!ghost || innerConfig.displayGhost) {
//                     b.setTotal(b.getTotal() + 1);
//                 }
//             })
//         );

//         pagesExposeFunctionPromise.push(
//             page.exposeFunction("h0xtyueiifhbc_EndWrap", function() {
//                 if (!ghost || innerConfig.displayGhost) {
//                     b.increment();
//                     if (b.getTotal() === b.value) {
//                         if (b.status === colors.white.bgYellow("running")) {
//                             b.status = colors.white.bgGreen("calculating");
//                         }
//                         updateStatus({ status: b.status });
//                     }
//                 }
//             })
//         );

//         pagesExposeFunctionPromise.push(
//             page.exposeFunction("h0xtyueiifhbc_StartExpect", function() {
//                 if (!ghost || innerConfig.displayGhost) {
//                     incrementExpect();
//                 }
//             })
//         );

//         pagesExposeFunctionPromise.push(
//             page.exposeFunction("h0xtyueiifhbc_EndExpect", function() {
//                 if (!ghost || innerConfig.displayGhost) {
//                     incrementEndExpect();
//                 }
//             })
//         );

//         pagesExposeFunctionPromise.push(
//             page.exposeFunction("h0xtyueiifhbc_FailTest", function(message) {
//                 isDead = "fail";
//                 failStack.push(message);
//                 if (innerConfig.log && innerConfig.authorizedLog.includes("error")) {
//                     fs.writeFileSync(_path.join(errorDir, `fail.json`), JSON.stringify(message, null, 4));
//                 }
//                 if (!ghost || innerConfig.displayGhost) {
//                     b.status = colors.white.bgRed("running");
//                     updateStatus({ status: b.status });
//                 }
//             })
//         );

//         pagesExposeFunctionPromise.push(
//             page.exposeFunction("h0xtyueiifhbc_GetAllFileInDir", path => {
//                 return readdirSync(path).filter(function(_path) {
//                     return !fs.statSync(_path).isDirectory();
//                 });
//             })
//         );

//         pagesExposeFunctionPromise.push(
//             page.exposeFunction("h0xtyueiifhbc_ImportTestPath", async testPath => {
//                 if (!ghost || innerConfig.displayGhost) {
//                     b.status = colors.white.bgYellow("importing");
//                     updateStatus({ status: b.status });
//                 }

//                 testPath = transformPathWebToFile(testPath);

//                 if (importCyclic.includes(testPath)) {
//                     // this statement detect if the test is cyclic (if yes it return juste the path and a isOk to true to the browser so we don't reStart a new Test (it also say that this test is a ghost test))
//                     return { ...loadedProp[testPath], isOk: true };
//                 }

//                 if (!ghost) {
//                     testImport[actualPath].push(testPath);
//                 }

//                 if (hasCycle(testImport, testPath)) {
//                     if (loadedProp[testPath].isEnded) {
//                         // ! this statement check if a ghost as already been called for this test (if yes we don't need to call it again)
//                         return { ...loadedProp[testPath] };
//                     }
//                     fs.writeFileSync(_path.join(debugDir, "i.json"), JSON.stringify(loadedProp[testPath], null, 4));

//                     // ! call newTest with ghost property to true
//                     let res = await newTest(testPath, true, { ghost: true, importCyclic: [...importCyclic, testPath] });
//                     if (res.isOk) {
//                         return { ...loadedProp[testPath], isOk: true };
//                     }
//                     return { ...loadedProp[testPath], isOk: false };
//                 }

//                 if (!loadedPromise[testPath]) {
//                     let res;
//                     let prom = new Promise(r => {
//                         res = r;
//                     });
//                     setTimeout(async () => {
//                         loadedPromise[testPath] = newTest(testPath, true);
//                         if (innerConfig.log && innerConfig.authorizedLog.includes("error")) {
//                             fs.writeFileSync(_path.join(errorDir, testPath.split("/").at(-1).replace(".browser.test.js", ".js")), JSON.stringify(await loadedPromise[testPath], null, 4));
//                         }
//                         res();
//                     }, innerConfig.timeToAwaitBetweenEachTest);

//                     await prom;
//                 }

//                 await loadedPromise[testPath];
//                 return loadedProp[testPath];
//             })
//         );

//         let res;
//         let prom = new Promise(r => {
//             res = r;
//         });

//         pagesExposeFunctionPromise.push(
//             page.exposeFunction("h0xtyueiifhbc_EndOfFile", mainWrapJson => {
//                 const stack = errorStack || failStack;

//                 // if (innerConfig.env === "debug") {
//                 //     fs.writeFileSync(_path.join(errorDir, `${stats.numOfEndTestFile}.json`), JSON.stringify({ path, pathModuleTest, stack, mainWrapJson }, null, 4));
//                 // }

//                 // fs.writeFileSync(_path.join(errorDir, `${stats.numOfEndTestFile}.json`), JSON.stringify({ path, pathModuleTest, errorStack, mainWrapJson }, null, 4));

//                 // ms to s
//                 const time = (performance.now() - startTime) / 1000;

//                 // fs.writeFileSync("mainWrap.json", mainWrapJson);
//                 (async function() {
//                     if (isDead === "error") {
//                         // ! this function don't work perfectly (it handle a string and it's not the best solution)
//                         let lastPath;
//                         // // fs.writeFileSync(_path.join(errorDir, `stack.${stats.numOfEndTestFile}.txt`), JSON.stringify({ h0xtyueiifhbc: path, ...errorStack }, null, 4));
//                         // return;
//                         // if (typeof errorStack != "string") {
//                         //     fs.writeFileSync(_path.join(errorDir, `${uuid}.txt`), path);
//                         // }
//                         // let line = errorStack.split("\n")[0];
//                         // if (line.startsWith("Error: the testModule ")) {
//                         //     lastPath = line.split("Error: the testModule ")[1].split(" handle a fail")[0];
//                         // } else if (line.startsWith("Error: import ")) {
//                         //     lastPath = line.split("Error: import ")[1].split(" failed")[0];
//                         // } else if (line.startsWith("the testModule ")) {
//                         //     lastPath = line.split("the testModule ")[1].split(" handle a fail")[0];
//                         // } else if (line.startsWith("import ")) {
//                         //     lastPath = line.split("import ")[1].split(" failed")[0];
//                         // } else {
//                         //     lastPath = transformPathWebToFile(errorStack.split("\n").at(-1).split("at ")[1]).split(":").slice(0, 2).join(":");
//                         // }
//                         // let uuidT = typeof lastPath == "string" ? (await loadedPromise[transformPathWebToFile(lastPath)]) ? .uuid : undefined;
//                         // fs.writeFileSync(
//                         //     _path.join(errorDir, `${uuid}.txt`),
//                         //     path + "\n\n\n" + errorStack + "\n\n\n" + (uuidT !== uuid ? (uuidT ? "last error log file " + transformPathFileToWeb(errorDir + "/" + uuidT) + ".txt" : lastPath) : "")
//                         // );
//                     } else if (isDead === "fail") {
//                     } else {
//                         //                         // is Dead is false
//                         //                         const dictError = new Map();
//                         //                         function rec(p, stack) {
//                         //                             if (p.childs) {
//                         //                                 p.childs.forEach(c => {
//                         //                                     rec(c, [...stack, p]);
//                         //                                 });
//                         //                             }
//                         //                             if (p.directTests) {
//                         //                                 p.directTests.forEach(c => {
//                         //                                     if (c.status === "fail") {
//                         //                                         if (!dictError.has([...stack, p].map(s => (s.descriptor ? `${s.name} : ${s.descriptor}` : s.name)).join(" > "))) {
//                         //                                             dictError.set([...stack, p].map(s => (s.descriptor ? `${s.name} : ${s.descriptor}` : s.name)).join(" > "), []);
//                         //                                         }
//                         //                                         dictError.get([...stack, p].map(s => (s.descriptor ? `${s.name} : ${s.descriptor}` : s.name)).join(" > ")).push(c);
//                         //                                     }
//                         //                                 });
//                         //                             }
//                         //                         }
//                         //                         rec(uncycle(JSON.parse(mainWrapJson)), []);
//                         //                         let string = "";
//                         //                         dictError.forEach((v, k) => {
//                         //                             v.forEach(t => {
//                         //                                 const ct = cycle(t);
//                         //                                 delete ct.parent;
//                         //                                 string += `${k} =>
//                         // ${JSON.stringify(ct, null, 4)}
//                         // `;
//                         //                             });
//                         //                         });
//                         //                         if (innerConfig.log && innerConfig.authorizedLog.includes("error")) {
//                         //                             fs.writeFileSync(_path.join(errorDir, `${actualPath.replace(/\\/g, ".").replace(/\//g, ".").replace(/:/g, "_")}.mainWrapJson.json`), mainWrapJson);
//                         //                         }
//                         //                         if (innerConfig.log && innerConfig.authorizedLog.includes("error")) {
//                         //                             if (string !== "") {
//                         //                                 fs.writeFileSync(_path.join(errorDir, `${loadedProp[actualPath].uuid}.txt`), actualPath + "\n\n\n" + string);
//                         //                             }
//                         //                         }
//                     }
//                 })();

//                 if (innerConfig.log && innerConfig.authorizedLog.includes("debug") && isDead !== false) {
//                     fs.writeFileSync(_path.join(debugDir, `stack.${stats.numOfEndTestFile}.txt`), stack ? JSON.stringify({ file: actualPath, stack }, null, 4) : "undefined");
//                 }

//                 loadedProp[actualPath].isEnded = true;
//                 loadedProp[actualPath].isOk = isDead === false;
//                 loadedProp[actualPath].stack = stack;

//                 if (ghost && innerConfig.displayGhost) {
//                     multibar.remove(b);
//                     activeBar.delete(b);
//                 }

//                 if (!ghost || innerConfig.displayGhost) {
//                     if (isDead === false) {
//                         b.status = colors.white.bgGreen("success");
//                     } else if (isDead === "error") {
//                         b.status = colors.white.bgRed(stack.name); //stack is an error stack
//                     } else if (isDead === "fail") {
//                         b.status = colors.white.bgRed("TestFail"); // stack is an array of failed tests
//                     } else {
//                         b.status = colors.white.bgRed("error");
//                     }
//                     updateStatus({ status: b.status, time: `${time > 10 ? colors.red(`${time.toFixed(2)} s`) : colors.magenta(`${time.toFixed(time < 2 ? 3 : time < 1 ? 4 : 2)} s`)}` });

//                     multibar.update();

//                     for (const bar of activeBar) {
//                         updateStatus({ bar: bar });
//                     }

//                     b.isOk = isDead === false;
//                     b.isEnded = true;
//                 }

//                 if (!ghost) {
//                     if (isDead !== false) {
//                         stats.numOfError = stats.numOfError + 1;
//                     } else {
//                         stats.numOfSucess = stats.numOfSucess + 1
//                     }
//                     stats.numOfExpect = b.numOfExpect + stats.numOfExpect
//                     stats.numOfEndExpect = b.numOfEndExpect + stats.numOfEndExpect
//                     stats.numOfWrap = stats.numOfWrap + b.getTotal()
//                     stats.numOfEndWrap = stats.numOfEndWrap + b.value
//                     stats.numOfEndTestFile = stats.numOfEndTestFile + 1
                    
//                     cursor
//                         .savePosition()
//                         .goto(0, 0)
//                         .write(
//                             colors.green("start") +
//                                 "   " +
//                                 colors.yellow(stats.numOfEndTestFile + "/" + (filesPath.length + 1)) +
//                                 " " +
//                                 (filesPath.length + 1 > 1 ? "files" : "file") +
//                                 "      " +
//                                 (displayGhostWithMultipleTestAtTheSameTime
//                                     ? colors.yellow("WARN :") + " " + colors.red("the display ghost can't be enable when multiple test at the same time is enabled")
//                                     : "")
//                         )
//                         .restorePosition();
//                 }

//                 if (innerConfig.screen.state) {
//                     if (!isImported && !ghost) {
//                         nextQueue();
//                     }
//                     if (innerConfig.log && innerConfig.authorizedLog.includes("error")) {
//                         fs.writeFileSync(_path.join(errorDir, `errorStack.${stats.numOfEndTestFile}.json`), JSON.stringify({ actualPath, stack, isOk: isDead === false, isDead }, null, 4));
//                     }
//                     res({ isOk: isDead === false });
//                     if (ghost) {
//                         page.close();
//                     } else if (innerConfig.screen.state === true && innerConfig.screen.clearOnSucess && isDead === false) {
//                         page.close();
//                     }
                
//                 } else {
//                     page.close().then(() => {
//                         if (!isImported && !ghost) {
//                             nextQueue();
//                         }
//                         if (innerConfig.log && innerConfig.authorizedLog.includes("error")) {
//                             fs.writeFileSync(_path.join(errorDir, `errorStack.${stats.numOfEndTestFile}.json`), JSON.stringify({ actualPath, stack, isOk: isDead === false, isDead }, null, 4));
//                         }
//                         res({ isOk: isDead === false });
//                     });
//                 }
//             })
//         );

//         await Promise.all(pagesExposeFunctionPromise);

//         page.setContent(
//             `<script type="module">${fs.readFileSync(`${__dirname}/../browser/browser.tester.js`, "utf8").replace(/h0xtyueiifhbcChange/g, `"${actualPath}"`)}</script><title>${_path
//                 .resolve(actualPath)
//                 .split("\\")
//                 .at(-1)}</title>`
//         );

//         return prom;
//     }

//     let queue = [];

//     let InHandle = 0;

//     function addQueue(path) {
//         queue.push(path);
//     }

//     function nextQueue() {
//         if (queue.length > 0) {
//             InHandle++;
//             let path = queue.shift();
//             if (loadedPromise[path]) {
//                 InHandle--;
//                 nextQueue();
//                 return;
//             }
//             setTimeout(function() {
//                 loadedPromise[path] = newTest(path).then();
//                 loadedPromise[path].then(() => {
//                     InHandle--;
//                     if (InHandle === 0) {
//                         // for (const bar of activeBar) {
//                         //     multibar.remove(bar);
//                         // }

//                         // console.log(testImport);

//                         // console.log(loadedPromise);

//                         // if (innerConfig.log && innerConfig.authorizedLog.includes("debug")) {
//                         //     fs.writeFileSync(_path.join(debugDir, `loadedPromise.txt`), JSON.stringify(loadedPromise, null, 4));
//                         // }

//                         if (innerConfig.log && innerConfig.authorizedLog.includes("debug")) {
//                             fs.writeFileSync(_path.join(debugDir, `loadedPromise.json`), JSON.stringify(loadedPromise, null, 4));
//                             fs.writeFileSync(_path.join(debugDir, `testImport.json`), JSON.stringify(testImport, null, 4));
//                             fs.writeFileSync(_path.join(debugDir, `loadedProp.json`), JSON.stringify(loadedProp, null, 4));
//                         }
                        
//                         if (innerConfig.bar.state && innerConfig.bar.clearOnSucess){
//                             for (const bar of Array.from(activeBar).reverse()) {
//                                 if (bar.isEnded && bar.isOk) {
//                                     bar.stop();
//                                     multibar.remove(bar);
//                                     activeBar.delete(bar);
//                                     barRemoved = true;
                                    
//                                 }
//                             }
//                         }
                        
//                         const deadBar = []
//                         const restBar = []
                        
//                         for (const bar of Array.from(activeBar)) {
//                             bar.stop()
//                             multibar.remove(bar)
//                             if (bar.isOk) {
//                                 restBar.push(bar)
//                             } else {
//                                 deadBar.push(bar)
//                             }
//                             activeBar.delete(bar)
//                         }
                        
//                         for (const bar of Array.from(deadBar)) {
//                             multibar.create(bar.getTotal(), bar.value, bar)
//                         }
                        
//                         for (const bar of Array.from(restBar)) {
//                             multibar.create(bar.getTotal(), bar.value, bar)
//                         }
                        
//                         multibar.stop();
                        
//                         const endTime = performance.now() - startGlobalTime;

//                         cursor.savePosition().goto(process.stdout.columns - `${(endTime / 1000).toFixed(2)} s`.length, 0).write(colors.blue(`${(endTime / 1000).toFixed(2)} s`)).restorePosition();

//                         console.log("\n" + colors.blue("a complete log of the error can be found in " + innerConfig.outDir.path) + "\n");
                        
//                         console.log(stats)

//                         if (!innerConfig.screen.state) {
//                             browser.close();
//                             process.exit(0);
//                         } else {
//                             if (innerConfig.screen.state === true && innerConfig.screen.closeOnAllSuccess && stats.numOfError === 0) {
//                                 browser.close();
//                                 process.exit(0);
//                             }
//                         }
//                     }
//                 });
//             }, innerConfig.timeToAwaitBetweenEachTest);
//         }
//     }

//     filesPath.forEach(file => {
//         addQueue(transformPathWebToFile(file));
//     });

//     for (let i = 0; i < innerConfig.NumberOfTestAtTheSameTime; i++) {
//         nextQueue();
//     }
// })(filesPath);
