const TypesDeclarator = require("./TypesDeclarator.super.js");
const { addInObject } = require("../bundle.js");

const classTypesDeclarator =  new class ClassTypesDeclarator extends TypesDeclarator {
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
        const [className, ...namespace] = str.split(".").reverse();
        const Class = eval(`( class ${className} { constructor(obj){Object.assign(this, obj)} } )`);
        addInObject(this, [...namespace, className], Class);
        return Class;
    }

    get(path) {}
}();

module.exports = classTypesDeclarator