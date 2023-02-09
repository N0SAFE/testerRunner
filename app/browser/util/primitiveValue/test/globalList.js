export const bodyList = {
    // extend: object || objectInstance
    objectInstance(type) {
        return `constructor(val, type){super(val, Array.isArray(type) ? [...type, "${type}"] : ["${type}"]);} /* objectInstance */`;
    },
    // extend: primitive
    object() {
        return `constructor(val, type) {super(val, type ? [type]: []);this.type = type || typeof val;} toString() {return "object";} /* object */`;
    },
    // extend: class || classInstance
    classInstance(type) {
        return `constructor(val, type){super(val, Array.isArray(type) ? [...type, "${type}"] : ["${type}"]);} /* classInstance */`;
    },
    // extend: primitive
    class() {
        return `constructor(val, type){super(val, type ? [type] : []);} toString(){return "class";} /* class */`;
    },
    // extend: primitive
    null_undefined(type) {
        return `constructor(){super(${type});} toString(){return "${type}";}`;
    },
    // extend: primitive
    string_bool(type) {
        return `constructor(val){super(val, "${type}");} toString(){return "${type}";}`;
    },
    // extend: primitive
    number() {
        return `constructor(val, type) {super(val, type ? ['number', type] : ['number']);}toString() {return "number";}`;
    },
    // extend: number
    bigint() {
        return `constructor(val) {super(val, "bigint");}toString() {return "bigint";}`;
    },
    // extend: primitive
    function() {
        return `constructor(val, type) {super(val);}toString() {return "function";}`;
    },
};
