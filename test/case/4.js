importNeed(["./chain1.browser.test.js", {type: "defer", default: function(){/** this function is load before load the module ./chain1.browser.test.js */}}]); // this things make the script load when the user whant it (if in the end the test as not load the script it's been throw an error) (the second arguments is the default way to load the script (with some global variable (if it exist)))

main(({ describe }) => {
    describe("chain1", async ({ it }) => {
        const { default: chain1 } = await it("should be the requested module with good properties", async ({ template: { default: { toBeImportable, toHaveProperties } } }) => {
            const { module } = await toBeImportable("./chain1.browser.test.js");
            return module;
        }).toThrow();
    })
})