// ! this object is for when an error is throwed in the function of a wrapper (like main, describe, it, test)

const GenericObject = require("./GenericObject");

module.exports = class WrapError extends GenericObject {
    constructor(message, stack) {
        super("WrapError", message, stack);
    }
};
