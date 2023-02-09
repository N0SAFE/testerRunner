main(async function ({ test, describe, it, expect }) {
    test("tet", async function ({ expect }) {
        expect(1).toBe(1);
    });

    test("tet2", async function ({ expect }) {
        await new Promise((res) => setTimeout(res, 3000));
        expect(1).toBe(2);
        expect(1).toBe(5);
        expect(null).toBeNull();
        await new Promise((res) => setTimeout(res, 3000));
        expect(1).toBe(2);
    });
});
