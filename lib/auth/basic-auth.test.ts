import { describe, expect, it } from "vitest";
import { hasValidPassword } from "./basic-auth";

const header = (user: string, password: string) => `Basic ${btoa(`${user}:${password}`)}`;

describe("hasValidPassword", () => {
  it("accepts the right password with any username", () => {
    expect(hasValidPassword(header("wasif", "test-secret"), "test-secret")).toBe(true);
    expect(hasValidPassword(header("", "test-secret"), "test-secret")).toBe(true);
  });

  it("allows a colon inside the password", () => {
    expect(hasValidPassword(header("a", "pa:ss"), "pa:ss")).toBe(true);
  });

  it("rejects a wrong, partial or missing password", () => {
    expect(hasValidPassword(header("a", "test-secre"), "test-secret")).toBe(false);
    expect(hasValidPassword(header("a", "test-secret!"), "test-secret")).toBe(false);
    expect(hasValidPassword(header("test-secret", ""), "test-secret")).toBe(false);
    expect(hasValidPassword(null, "test-secret")).toBe(false);
  });

  it("rejects malformed headers", () => {
    expect(hasValidPassword("Bearer abc", "test-secret")).toBe(false);
    expect(hasValidPassword("Basic !!!not-base64", "test-secret")).toBe(false);
    expect(hasValidPassword(`Basic ${btoa("no-colon")}`, "test-secret")).toBe(false);
  });

  it("never accepts anything when no password is configured", () => {
    expect(hasValidPassword(header("a", ""), "")).toBe(false);
  });
});
