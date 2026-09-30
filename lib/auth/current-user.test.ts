import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => ({ value: "elite" }) }) }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("getCurrentUser by environment", () => {
  it("returns nobody in production, even with a demo tier cookie", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const mod = await import("./current-user");
    expect(mod.demoModeEnabled).toBe(false);
    expect(await mod.getCurrentUser()).toBeNull();
  });

  it("returns the demo student on previews", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const mod = await import("./current-user");
    expect((await mod.getCurrentUser())?.tier).toBe("elite");
  });
});
