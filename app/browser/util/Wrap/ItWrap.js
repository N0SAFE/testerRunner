import {Wrap} from './Wrap.js';
export class ItWrap extends Wrap {
    constructor(descriptor, parent, beforeAfterCallback) {
        super(descriptor, parent, "It", beforeAfterCallback)
    }
}