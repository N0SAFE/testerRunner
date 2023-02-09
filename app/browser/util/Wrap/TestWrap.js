import {Wrap} from './Wrap.js';
export class TestWrap extends Wrap {
    constructor(descriptor, parent, beforeAfterCallback) {
        super(descriptor, parent, "Test", beforeAfterCallback)
    }
 }