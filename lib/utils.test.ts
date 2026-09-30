import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins class names and drops falsy values", () => {
    expect(cn("px-4", false, undefined, "py-2")).toBe("px-4 py-2");
  });

  it("lets a later Tailwind class override an earlier one", () => {
    expect(cn("px-4 text-sm", "px-6")).toBe("text-sm px-6");
  });
});
