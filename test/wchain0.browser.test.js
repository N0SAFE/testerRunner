main(function ({ test }) {
    test("it should throw an error", function ({ expect }) {
        expect("noExist.t").toBeImportable().toThrow();
    });
})