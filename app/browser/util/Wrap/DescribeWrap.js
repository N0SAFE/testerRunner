import {Wrap} from './Wrap.js';
export class DescribeWrap extends Wrap {
    constructor(descriptor, parent, beforeAfterCallback) {
        super(descriptor, parent, "Describe", beforeAfterCallback)
    }
}