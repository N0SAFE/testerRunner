// ! this class is used when a test fail (an except is not good)

import GenericStack from "./GenericStack.js";

export default class TestFail extends GenericStack {
    constructor(message, failStack) {
        super("TestFail", message, failStack);
    }
}