const GenericObject = require('./GenericObject')

module.exports = class GeneriqueError extends GenericObject {
    constructor(message, stack) {
        super("GeneriqueError", message, stack);
    }
};
