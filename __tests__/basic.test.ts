describe("Basic functionality", () => {
  test("math works correctly", () => {
    expect(2 + 2).toBe(4);
    expect(10 - 5).toBe(5);
    expect(3 * 4).toBe(12);
  });

  test("string operations work", () => {
    const text = "hello world";
    expect(text).toContain("world");
    expect(text.length).toBe(11);
  });

  test("arrays work as expected", () => {
    const items = [1, 2, 3];
    expect(items).toHaveLength(3);
    expect(items[0]).toBe(1);
  });
});
