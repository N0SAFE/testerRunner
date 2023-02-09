// this error class is the super class for all other type of error not thought

module.exports = class GenericObject {
    constructor(name, message, stack) {
        this.name = name;
        this.message = message;
        this.stack = stack;
    }
}