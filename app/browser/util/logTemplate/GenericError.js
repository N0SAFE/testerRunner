import GenericStack from "./GenericStack.js";

export default class GenericError extends GenericStack {
    constructor(message, stack) {
        super("GeneriqueError", message, stack)
    }
}