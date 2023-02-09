// ! this class is used when a test fail (an except is not good)

const GenericObject = require("./GenericObject");

module.exports = class TestFail extends GenericObject {
    constructor(message, stack) {
        super("TestFail", message, stack);
    }
};