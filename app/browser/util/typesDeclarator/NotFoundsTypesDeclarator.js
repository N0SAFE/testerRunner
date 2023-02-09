import { addInObject } from "../bundle.js";
import TypesDeclarator from "./TypesDeclarator.super.js";


class NotFound {}

export default new (class NotFoundsTypesDeclarator extends TypesDeclarator {
    default = NotFound;
    searchInObject = class extends NotFound {};
    match = class extends NotFound {};

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
        const [className, ...namespace] = str.split(".").reverse();
        const Class = eval(`( class ${className} extends NotFound { } )`);
        addInObject(this, [...namespace, className], Class);
        return Class;
    }

    get(path) {}
})();
