const GenericObject = require("./GenericObject");

module.exports = class InternalImportError extends GenericObject {
    constructor(message, stack) {
        super("InternalImportError", message, stack);
    }
};
