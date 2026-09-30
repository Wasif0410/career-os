import { describe, expect, it } from "vitest";
import { parseTier } from "./current-user";
import { initials } from "./user";

describe("initials", () => {
  it("takes the first letter of each name, upper-cased", () => {
    expect(initials({ firstName: "maya", lastName: "chen" })).toBe("MC");
  });
});

describe("parseTier", () => {
  it("accepts known tiers and rejects anything else", () => {
    expect(parseTier("pro")).toBe("pro");
    expect(parseTier("admin")).toBeUndefined();
    expect(parseTier(undefined)).toBeUndefined();
  });
});
