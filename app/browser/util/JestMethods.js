import { MainWrap } from "./Wrap/MainWrap.js";
import { ExpectWrap } from "./Wrap/ExpectWrap.js";
import { TestWrap } from "./Wrap/TestWrap.js";
import { ItWrap } from "./Wrap/ItWrap.js";
import { DescribeWrap } from "./Wrap/DescribeWrap.js";
import { ExpectMethods } from "./jestFunctionReplicate/ExpectMethods/ExpectMethods.js";
import { testTemplateUse } from "./specialFunction.js";
import { isFunction, cycle } from "./bundle.js";
import { mockFn } from "./jestFunctionReplicate/MockFunction.js";

export function expect(defaultVal) {
    h0xtyueiifhbc_StartExpect();
    const parentWrap = this;
    let res;
    let promise = new Promise(resolve => (res = resolve));
    promise.res = res;
    parentWrap.add(promise);
    const expectWrap = new ExpectWrap(parentWrap, promise);
    parentWrap.tests.push(expectWrap);
    parentWrap.directTests.push(expectWrap);

    promise.then(() => {
        if (expectWrap.status !== "fail") {
            h0xtyueiifhbc_EndExpect();
        }
    });

    return new ExpectMethods(defaultVal, expectWrap);
}

export function it(descriptor, callback) {
    if (!isFunction(callback)) {
        throw new Error("the callback must be a function");
    }
    h0xtyueiifhbc_StartWrap();
    const parentWrap = this;
    let res;
    this.add(new Promise(resolve => (res = resolve)));
    const itWrap = new ItWrap(descriptor, this, {
        beforeAllCallback: parentWrap.beforeAllCallback,
        afterAllCallback: parentWrap.afterAllCallback
    });
    let promise = (async () => {
        for (const c of parentWrap.beforeAllCallback) {
            await c();
        }
        for (const c of parentWrap.beforeEachCallback) {
            await c();
        }
        let ret;
        try {
            ret = await callback({
                describe: describe.bind(itWrap),
                it: it.bind(itWrap),
                test: test.bind(itWrap),
                expect: expect.bind(itWrap),
                iFunc: iFunc,
                template: testTemplateUse(itWrap),
                beforeEach: beforeEach.bind(itWrap),
                afterEach: afterEach.bind(itWrap),
                beforeAll: beforeAll.bind(itWrap),
                afterAll: afterAll.bind(itWrap),
                mockFn: mockFn.bind(itWrap)
            });
            await itWrap.awaitPromises().then(() => res(itWrap));
            h0xtyueiifhbc_EndWrap();
        } catch (e) {
            console.error(e);
            itWrap.throwWrap(e);
            ret = undefined;
        }
        for (const c of parentWrap.afterAllCallback) {
            await c();
        }
        for (const c of parentWrap.afterEachCallback) {
            await c();
        }
        return ret;
    })();
    promise.toThrow = function() {
        return promise.then(function() {
            if (itWrap.status === "fail") {
                itWrap.throwWrap(new Error("the test module has been throwed"));
            }
            return promise;
        });
    };
    return promise;
}

export function describe(descriptor, callback) {
    if (!isFunction(callback)) {
        throw new Error("the callback must be a function");
    }
    h0xtyueiifhbc_StartWrap();
    const parentWrap = this;
    let res;
    this.add(new Promise(resolve => (res = resolve)));
    const describeWrap = new DescribeWrap(descriptor, this, {
        beforeAllCallback: parentWrap.beforeAllCallback,
        afterAllCallback: parentWrap.afterAllCallback
    });
    let promise = (async () => {
        for (const c of parentWrap.beforeAllCallback) {
            await c();
        }
        for (const c of parentWrap.beforeEachCallback) {
            await c();
        }
        let ret;
        try {
            ret = await callback({
                describe: describe.bind(describeWrap),
                it: it.bind(describeWrap),
                test: test.bind(describeWrap),
                expect: expect.bind(describeWrap),
                iFunc: iFunc,
                template: testTemplateUse(describeWrap),
                beforeEach: beforeEach.bind(describeWrap),
                afterEach: afterEach.bind(describeWrap),
                beforeAll: beforeAll.bind(describeWrap),
                afterAll: afterAll.bind(describeWrap),
                mockFn: mockFn.bind(describeWrap)
            });
            await describeWrap.awaitPromises().then(() => res(describeWrap));
            h0xtyueiifhbc_EndWrap();
        } catch (e) {
            describeWrap.throwWrap(e);
            ret = undefined;
        }
        for (const c of parentWrap.afterAllCallback) {
            await c();
        }
        for (const c of parentWrap.afterEachCallback) {
            await c();
        }
    })();
    promise.toThrow = function() {
        return promise.then(function() {
            if (describeWrap.status === "fail") {
                describeWrap.throwWrap(new Error("the test module has been throwed"));
            }
            return promise;
        });
    };
    return promise;
}

export function test(descriptor, callback) {
    if (!isFunction(callback)) {
        throw new Error("the callback must be a function");
    }
    h0xtyueiifhbc_StartWrap();
    const parentWrap = this;
    let res;
    this.add(new Promise(resolve => (res = resolve)));
    const testWrap = new TestWrap(descriptor, this, {
        beforeAllCallback: parentWrap.beforeAllCallback,
        afterAllCallback: parentWrap.afterAllCallback
    });
    let testsPush = testWrap.tests.push;
    testWrap.tests.push = function() {
        testsPush.apply(this, arguments);
    };
    let promise = (async () => {
        for (const c of parentWrap.beforeAllCallback) {
            await c();
        }
        for (const c of parentWrap.beforeEachCallback) {
            await c();
        }
        let ret;
        try {
            ret = await callback({
                describe: describe.bind(testWrap),
                it: it.bind(testWrap),
                test: test.bind(testWrap),
                expect: expect.bind(testWrap),
                iFunc: iFunc,
                template: testTemplateUse(testWrap),
                beforeEach: beforeEach.bind(testWrap),
                afterEach: afterEach.bind(testWrap),
                beforeAll: beforeAll.bind(testWrap),
                afterAll: afterAll.bind(testWrap),
                mockFn: mockFn.bind(testWrap)
            });
            await testWrap.awaitPromises().then(() => res(testWrap));
            h0xtyueiifhbc_EndWrap();
        } catch (e) {
            console.error(e);
            testWrap.throwWrap(e);
        }
        for (const c of parentWrap.afterAllCallback) {
            await c();
        }
        for (const c of parentWrap.afterEachCallback) {
            await c();
        }
        return ret;
    })();
    promise.toThrow = function() {
        return promise.then(function() {
            if (testWrap.status === "fail") {
                testWrap.throwWrap(new Error("the test module has been throwed"));
            }
            return promise;
        });
    };
    return promise;
}

export function main(callback) {
    const mainWrap = new MainWrap();

    h0xtyueiifhbc_Start();
    window.h0xtyueiifhbc_Started = true
    return new Promise(async res => {
        try {
            await callback({
                describe: describe.bind(mainWrap),
                it: it.bind(mainWrap),
                test: test.bind(mainWrap),
                expect: expect.bind(mainWrap),
                iFunc: iFunc,
                template: testTemplateUse(mainWrap),
                beforeEach: beforeEach.bind(mainWrap),
                afterEach: afterEach.bind(mainWrap),
                beforeAll: beforeAll.bind(mainWrap),
                afterAll: afterAll.bind(mainWrap),
                mockFn: mockFn.bind(mainWrap)
            });

            await mainWrap.awaitPromises().then(() => {
                delete mainWrap.promises;
                return mainWrap;
            });
        } catch (e) {
            mainWrap.throwWrap(e);
            res(mainWrap);
        }

        // console.log("time", endTime - startTime);

        console.log(mainWrap);

        // console.log(JSON.stringify(cycle(mainWrap)));
        if (!window.h0xtyueiifhbc_TestIsFinish) {
            window.h0xtyueiifhbc_TestIsFinish = true;
            console.trace("end");
            h0xtyueiifhbc_EndOfFile(JSON.stringify(cycle(mainWrap, { seenType: "linear" }), null, 4));
        }

        res(mainWrap);
    });
}

export function beforeEach(callback) {
    const parentWrap = this;
    parentWrap.beforeEachCallback.push(callback);
}

export function afterEach(callback) {
    const parentWrap = this;
    parentWrap.afterEachCallback.push(callback);
}

export function beforeAll(callback) {
    const parentWrap = this;
    parentWrap.beforeAllCallback.push(callback);
}

export function afterAll(callback) {
    const parentWrap = this;
    parentWrap.afterAllCallback.push(callback);
}
