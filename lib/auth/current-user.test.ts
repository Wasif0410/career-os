import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => ({ value: "elite" }) }) }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("getCurrentUser by environment", () => {
  it("returns nobody in production without APP_PASSWORD, even with a demo tier cookie", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("APP_PASSWORD", "");
    const mod = await import("./current-user");
    expect(mod.demoModeEnabled).toBe(false);
    expect(await mod.getCurrentUser()).toBeNull();
  });

  it("returns the demo student in production when APP_PASSWORD is set", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("APP_PASSWORD", "test-secret");
    const mod = await import("./current-user");
    expect((await mod.getCurrentUser())?.tier).toBe("elite");
  });

  it("returns the demo student on previews", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const mod = await import("./current-user");
    expect((await mod.getCurrentUser())?.tier).toBe("elite");
  });
});
