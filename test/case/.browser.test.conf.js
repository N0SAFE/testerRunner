module.exports = {
    toAvoid: ["node_modules", "assetsBrowserTest"],
    log: false,
    authorizedLog: ["log", "error", "debug"],
    screen: {
        state: true,
        clearOnSuccess: false,
        closeOnAllSuccess: false
    },
    NumberOfTestAtTheSameTime: 1,
    timeToAwaitBetweenEachTest: 500,
    exitOnError: false,
    ui: "disabled",
    displayGhost: true
};
