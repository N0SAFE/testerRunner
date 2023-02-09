main(function({ describe, beforeAll, beforeEach, afterAll, afterEach }) {
    beforeAll(() => {
        console.log("beforeAll 1");
    });
    beforeEach(() => {
        console.log("beforeEach 1");
    });
    afterAll(() => {
        console.log("afterAll 1");
    });
    afterEach(() => {
        console.log("afterEach 1");
    });
    describe("describe", function ({ test, beforeAll, beforeEach, afterAll, afterEach }) {
        beforeAll(() => {
            console.log("beforeAll 2");
        });
        beforeEach(() => {
            console.log("beforeEach 2");
        });
        afterAll(() => {
            console.log("afterAll 2");
        });
        afterEach(() => {
            console.log("afterEach 2");
        });
        test("test", function({ expect }) {
            console.log("in");
        });
    });
});
