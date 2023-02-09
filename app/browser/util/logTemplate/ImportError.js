import GenericObject from "./GenericObject.js";
import { isJson } from "../bundle.js";

export default class ImportError extends GenericObject {
    constructor(message, importedModulePath, { previous, error } = {}) {
        super("ImportError", message)
        this.importedModulePath = (isJson(importedModulePath) ? JSON.parse(importedModulePath) : importedModulePath)
        this.previous = (isJson(previous) ? JSON.parse(previous) : previous || null)
        this.error = (isJson(error) ? JSON.parse(error) : error || null)
    }
}
