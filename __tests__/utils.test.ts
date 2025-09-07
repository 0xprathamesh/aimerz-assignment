import { cn } from "@/lib/utils";

describe("Utility functions", () => {
  test("cn function merges classes properly", () => {
    const result = cn("class1", "class2");
    expect(result).toBe("class1 class2");
  });

  test("cn handles conditional classes", () => {
    const result = cn("base", true && "active");
    expect(result).toBe("base active");
  });

  test("cn ignores falsy values", () => {
    const result = cn("base", false && "hidden", null, undefined);
    expect(result).toBe("base");
  });
});
