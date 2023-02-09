main(({ describe }) => {
    describe("spyOn", ({ it }) => {
        it("should test spyOn", function({ expect, spyOn }) {
            const obj = {
                foo: function() {
                    return "foo";
                }
            };
            const spy = spyOn(obj, "foo");
            expect(obj.foo()).toBe("foo");
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith();
            expect(spy).toHaveReturnedWith("foo");
        });
    });
});
