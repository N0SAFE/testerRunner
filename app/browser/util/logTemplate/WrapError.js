// ! this object is for when an error is throwed in the function of a wrapper (like main, describe, it, test)

import GenericStack from "./GenericStack.js";
import { isJson } from "../bundle.js";

export default class WrapError extends GenericStack {
    constructor(message, stack, wrapProp) {
        super("WrapError", message, stack);
        this.wrapProp = isJson(wrapProp) ? JSON.parse(wrapProp) : wrapProp;
    }
}
