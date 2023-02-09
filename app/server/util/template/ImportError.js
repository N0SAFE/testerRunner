const GenericObject = require("./GenericObject");

module.exports = class ImportError extends GenericObject {
    constructor(message, stack) {
        super("ImportError", message, stack);
    }
};
