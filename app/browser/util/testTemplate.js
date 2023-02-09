export function toBeImportable({ test }, [path], parentWrap) {
    return test("toBeImportable", ({ expect }) => {
        return expect(path).toBeImportable();
    });
}

export function toHaveProperties({ test }, [object, properties]) {
    return test("toHaveProperties", ({ expect }) => {
        return expect(object).toHaveProperties(properties);
    });
}