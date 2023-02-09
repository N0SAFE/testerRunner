import GenericObject from "./GenericObject.js";
import { isJson } from "../bundle.js";

export default class InternalImportError extends GenericObject {
    constructor(message, error, importedModulePath) {
        super("InternalImportError", message);
        this.error = error
        this.importedModulePath = (isJson(importedModulePath) ? JSON.parse(importedModulePath) : importedModulePath)
    }
}