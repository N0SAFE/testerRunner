import { camelCase, match } from "../../../util/util.js";
import { PrimitiveClassMap } from "../../verification/typeVerification.js";


export default class Primitive {
    constructor(val, type = []) {
        this.val = val;
        this.type = type;
    }

    typeof(i = null) {
        if (Number.isInteger(i)) {
            return this.type.at(i);
        }
        return this.type;
    }

    isOr(...args) {
        return args.some((arg) => this.is(arg));
    }

    isNot(...args) {
        return !this.isOr(...args);
    }

    isAnd(...args) {
        return args.every((arg) => this.is(arg));
    }

    isNotAnd(...args) {
        return !this.isAnd(...args);
    }

    isNotOr(...args) {
        return !this.isOr(...args);
    }

    is(val) {
        const self = this;
        if (typeof val === "string") {
            const FunctionPrimitiveClass = PrimitiveClassMap.get("Function");

            val = camelCase(val);
            return match(
                val,
                {
                    AsyncFunction() {
                        if (
                            self instanceof FunctionPrimitiveClass &&
                            [
                                "async function",
                                "async arrow function",
                                "async generator function",
                            ].includes(self.typeof(0))
                        ) {
                            return true;
                        }
                        return false;
                    },
                    SyncFunction() {
                        if (
                            self instanceof FunctionPrimitiveClass &&
                            [
                                "function",
                                "arrow function",
                                "generator function",
                            ].includes(self.typeof(0))
                        ) {
                            return true;
                        }
                        return false;
                    },
                    PlainFunction() {
                        if (
                            self instanceof FunctionPrimitiveClass &&
                            [
                                "function",
                                "async function",
                                "generator function",
                                "async generator function",
                            ].includes(self.typeof(0))
                        ) {
                            return true;
                        }
                        return false;
                    },
                    AsyncPlainFunction() {
                        if (
                            self instanceof FunctionPrimitiveClass &&
                            [
                                "async function",
                                "async generator function",
                            ].includes(self.typeof(0))
                        ) {
                            return true;
                        }
                        return false;
                    },
                    SyncPlainFunction() {
                        if (
                            self instanceof FunctionPrimitiveClass &&
                            ["function", "generator function"].includes(
                                self.typeof(0)
                            )
                        ) {
                            return true;
                        }
                        return false;
                    },
                    ArrowFunction() {
                        if (
                            self instanceof FunctionPrimitiveClass &&
                            ["arrow function", "async arrow function"].includes(
                                self.typeof(0)
                            )
                        ) {
                            return true;
                        }
                        return false;
                    },
                    AsyncArrowFunction() {
                        if (
                            self instanceof FunctionPrimitiveClass &&
                            ["async arrow function"].includes(self.typeof(0))
                        ) {
                            return true;
                        }
                        return false;
                    },
                    SyncArrowFunction() {
                        if (
                            self instanceof FunctionPrimitiveClass &&
                            ["arrow function"].includes(self.typeof(0))
                        ) {
                            return true;
                        }
                        return false;
                    },
                    GeneratorFunction() {
                        if (
                            self instanceof FunctionPrimitiveClass &&
                            [
                                "generator function",
                                "async generator function",
                            ].includes(self.typeof(0))
                        ) {
                            return true;
                        }
                        return false;
                    },
                    AsyncGeneratorFunction() {
                        if (
                            self instanceof FunctionPrimitiveClass &&
                            ["async generator function"].includes(
                                self.typeof(0)
                            )
                        ) {
                            return true;
                        }
                        return false;
                    },
                    SyncGeneratorFunction() {
                        if (
                            self instanceof FunctionPrimitiveClass &&
                            ["generator function"].includes(self.typeof(0))
                        ) {
                            return true;
                        }
                        return false;
                    },
                },
                function (str) {
                    return PrimitiveClassMap.has(str)
                        ? self instanceof PrimitiveClassMap.get(str)
                        : false;
                }
            );
        }

        if (val instanceof Primitive) {
            return self instanceof val;
        }

        if (val instanceof Object) {
            return self.val instanceof val;
        }

        if (typeof val === "string") {
            return typeof self === val;
        }

        return self.val === val;
    }
}
