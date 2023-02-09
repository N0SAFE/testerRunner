// ! this error class as to be the error throwed when the internal function throw an error (index.js or browser.tester.js) (if this files throw an unexpected error)

import GenericStack from "./GenericStack.js";

export default class InternalError extends GenericStack {
    constructor(message, stack) {
        super("InternalError", message, stack);
    }
}