import { beforeEach, describe, expect, it, vi } from "vitest";

describe("EarnedApi", () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
  });

  it("adjunta token de autorización en requests", async () => {
    localStorage.setItem("token", "jwt-token");

    const requestUse = vi.fn((handler) => {
      const config = handler({ headers: {} });
      expect(config.headers.Authorization).toBe("Bearer jwt-token");
      return config;
    });

    vi.doMock("axios", () => ({
      default: {
        create: vi.fn(() => ({
          interceptors: {
            request: { use: requestUse },
          },
        })),
      },
    }));

    await import("./EarnedApi");

    expect(requestUse).toHaveBeenCalled();
  });

  it("no adjunta header si no hay token", async () => {
    const requestUse = vi.fn((handler) => {
      const config = handler({ headers: {} });
      expect(config.headers.Authorization).toBeUndefined();
      return config;
    });

    vi.doMock("axios", () => ({
      default: {
        create: vi.fn(() => ({
          interceptors: {
            request: { use: requestUse },
          },
        })),
      },
    }));

    await import("./EarnedApi");

    expect(requestUse).toHaveBeenCalled();
  });
});
