// this error class is the super class for all other type of error not thought

import { isJson } from "../bundle.js";

export default class GenericObject {
    constructor(name, message) {
        this.name = (isJson(name) ? JSON.parse(name) : name)
        this.file = (isJson(window.h0xtyueiifhbc) ? JSON.parse(window.h0xtyueiifhbc) : window.h0xtyueiifhbc)
        this.message = (isJson(message) ? JSON.parse(message) : message)
    }
}