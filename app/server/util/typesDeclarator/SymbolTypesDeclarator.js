const TypesDeclarator = require("./TypesDeclarator.super.js");
const { addInObject } = require("../bundle.js");

const symbolTypesDeclarator = new class SymbolTypesDeclarator extends TypesDeclarator {
    customFunction = Symbol("customFunction");

    __array__ = new TypesDeclarator.Container(
        {
            create(...strs) {
                return strs.map(this.__getParent().create);
            },

            get(...paths) {
                return paths.map(this.__getParent().get);
            }
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
}();

module.exports = symbolTypesDeclarator;
