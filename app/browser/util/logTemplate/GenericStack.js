import GenericObject from "./GenericObject.js";
import { isJson } from "../bundle.js";

export default class GenericStack extends GenericObject {
    constructor(name, message, stack) {
        super(name, message);
        if(typeof stack === "string"){
            stack = stack;
        }
        this.stack = isJson(stack) ? JSON.parse(stack) : stack;
    }
}
