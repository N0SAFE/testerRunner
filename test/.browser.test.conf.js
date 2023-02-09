module.exports = {
    toAvoid: ["node_modules", "assetsBrowserTest"],
    log: false,
    authorizedLog: ["log", "error", "debug"],
    screen: {
        state: true,
        clearOnSuccess: true,
        closeOnAllSuccess: true
    },
    NumberOfTestAtTheSameTime: 1,
    timeToAwaitBetweenEachTest: 0,
    exitOnError: false,
};
