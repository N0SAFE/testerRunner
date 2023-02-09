// ! this error class as to be the error throwed when the internal function throw an error (index.js or browser.tester.js) (if this files throw an unexpected error)

const GenericObject = require("./GenericObject");

module.exports= class InternalError extends GenericObject {
    constructor(message, stack) {
        super("InternalError", message, stack);
    }
}