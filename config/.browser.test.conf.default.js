module.exports = {
    toAvoid: ["node_modules"],
    log: false,
    screen: {
        state: false,
        clearOnSuccess: true,
        closeOnAllSuccess: true
    },
    NumberOfTestAtTheSameTime: 1,
    timeToAwaitBetweenEachTest: 0,
    exitOnError: true,
};

// base is for the normal feature
// debug is for the debug features (for the test developper)
