import { Wrap } from "./Wrap.js";
export class ExpectWrap extends Wrap {
    constructor(parent, promise) {
        super("expect function", parent, "Expect");

        delete this.tests;
        delete this.directTests;
        
        delete this.beforeAllCallback       
        delete this.beforeEachCallback      
        delete this.afterAllCallback
        delete this.afterEachCallback

        this.parent = parent;
        this.end = function(resolveValue) {
            promise.res(resolveValue);
            return promise;
        };
    }
}
