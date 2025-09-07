import { PRIORITIES, CATEGORIES, STATUSES } from "@/lib/constants";

describe("App constants", () => {
  test("priorities are defined correctly", () => {
    expect(PRIORITIES).toContain("low");
    expect(PRIORITIES).toContain("medium");
    expect(PRIORITIES).toContain("high");
    expect(PRIORITIES.length).toBe(3);
  });

  test("categories are defined correctly", () => {
    expect(CATEGORIES).toContain("Work");
    expect(CATEGORIES).toContain("Personal");
    expect(CATEGORIES).toContain("Shopping");
    expect(CATEGORIES.length).toBe(9);
  });

  test("statuses are defined correctly", () => {
    expect(STATUSES).toContain("pending");
    expect(STATUSES).toContain("completed");
    expect(STATUSES.length).toBe(2);
  });
});
