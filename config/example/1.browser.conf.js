module.exports = {
    redirect: "src/", // this is the path where the test are located (this path is used just for the test and not for the log output (outDir will be in the root)) 
    outDir: {
        path: "assetsBrowserTest/",
        type: {
            log: "log/",
            error: "error/",
            debug: "debug/"
        },
        clean: true // if true it will clean the outDir folder before the test
    },
    toAvoid: ["node_modules", "assetsBrowserTest"], // this is the path that will be avoided by the test
    log: false, // if true it will authrorized the log
    authorizedLog: ["log", "error", "debug"], // this is the type of log that will be outputed
    screen: {
        state: true, // if true the test will be displayed in the browser
        clearSuccess: true, // if true and the screen state is at true the test that are success will be cleared from the screen
    }, 
    NumberOfTestAtTheSameTime: 10, // this is the number of test that will be run at the same time
    timeToAwaitBetweenEachTest: 0 // this is the time to wait between each test
};
