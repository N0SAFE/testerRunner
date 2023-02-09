import { Wrap } from "./Wrap.js";
export class MainWrap extends Wrap {
    constructor() {
        super("test the module " + window.h0xtyueiifhbc, null, "Main");
        this.promises = [];
        this.tests = [];
        this.directTests = [];
    }

    set status(val) {
        this._status = val;
    }
    get status() {
        return this._status;
    }

    getMain() {
        return this;
    }
}
