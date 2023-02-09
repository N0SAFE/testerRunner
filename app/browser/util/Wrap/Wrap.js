import WrapError from "../logTemplate/WrapError.js";

export class Wrap {
    beforeEachCallback = []; // the each is called only on the child wrap that is directly in this wrap
    afterEachCallback = []; // the each is called only on the child wrap that is directly in this wrap
    beforeAllCallback = []; // the all is called on all the child wrap
    afterAllCallack = []; // the all is called on all the child wrap

    set status(val) {
        this._status = val;
        if (this.parent.status !== "fail") {
            this.parent.status = val;
        }
    }
    get status() {
        return this._status;
    }
    promises = [];
    tests = [];
    directTests = [];
    error = null;
    throwWrap = function(e) {
        console.error(e);
        if (!window.h0xtyueiifhbc_TestIsFinish) {
            console.trace("test is finish");
            window.h0xtyueiifhbc_TestIsFinish = true;
            h0xtyueiifhbc_ThrowError(new WrapError(e.message, e.stack, { name: this.name, descriptor: this.descriptor, status: this.status, error: this.error }));
        }
    };

    constructor(descriptor, parent, name, { beforeAllCallback = [], afterAllCallback = [] } = {}) {
        this.descriptor = descriptor;
        this.parent = parent;
        this.name = name;
        this.beforeAllCallback = [...beforeAllCallback];
        this.afterAllCallback = [...afterAllCallback];
        this.tests.push = function() {
            Array.prototype.push.apply(this, arguments);
            parent.tests.push.apply(parent.tests, arguments);
        };
    }

    /** @return {MainWrap} */
    getMain() {
        return this.parent.getMain();
    }

    add(promise) {
        this.promises.push(promise);
    }

    awaitPromises() {
        const self = this;
        // console.trace("ui");
        return Promise.all(this.promises).then(childs => {
            self.childs = childs;
            delete self.promises;
        });
    }
}
