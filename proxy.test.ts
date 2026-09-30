import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { accountNav, appNav } from "@/components/app/nav-items";
import { config, proxy } from "./proxy";

const request = (authorization?: string) =>
  new NextRequest("http://localhost:3000/dashboard", { headers: authorization ? { authorization } : {} });

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("proxy", () => {
  it("covers every student app route", () => {
    for (const { href } of [...appNav, ...accountNav]) expect(config.matcher).toContain(`${href}/:path*`);
  });

  it("lets requests through when APP_PASSWORD isn't set", () => {
    vi.stubEnv("APP_PASSWORD", "");
    expect(proxy(request()).status).toBe(200);
  });

  it("asks for the password when it's set", () => {
    vi.stubEnv("APP_PASSWORD", "test-secret");
    const response = proxy(request());
    expect(response.status).toBe(401);
    expect(response.headers.get("www-authenticate")).toMatch(/^Basic /);
  });

  it("rejects a wrong password and accepts the right one", () => {
    vi.stubEnv("APP_PASSWORD", "test-secret");
    expect(proxy(request(`Basic ${btoa("me:nope")}`)).status).toBe(401);
    expect(proxy(request(`Basic ${btoa("me:test-secret")}`)).status).toBe(200);
  });
});
