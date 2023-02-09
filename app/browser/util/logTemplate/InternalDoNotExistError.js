import GenericObject from "./GenericObject.js";
import { isJson } from "../bundle.js";

export default class InternalDoNotExistError extends GenericObject {
    constructor(message, error, importedModulePath) {
        super("InternalDoNotExistError", message);
        this.error = error
        this.importedModulePath = (isJson(importedModulePath) ? JSON.parse(importedModulePath) : importedModulePath);
    }
}