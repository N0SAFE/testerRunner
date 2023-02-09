import TypesDeclarator from "./TypesDeclarator.super.js";
import { addInObject } from "../bundle.js";

export default new (class SymbolTypesDeclarator extends TypesDeclarator {
    customFunction = Symbol("customFunction");

    __array__ = new TypesDeclarator.Container(
        {
            create(...strs) {
                return strs.map(this.__getParent().create);
            },

            get(...paths) {
                return paths.map(this.__getParent().get);
            },
        },
        this
    );

    create(str) {
        const [symbolName, ...namespace] = str.split(".").reverse();
        const Symbol = Symbol(symbolName);
        addInObject(this, [...namespace, symbolName], Symbol);
        return Symbol;
    }

    get(path) {}
})();
