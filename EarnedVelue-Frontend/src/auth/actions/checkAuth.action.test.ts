import { beforeEach, describe, expect, it, vi } from "vitest";
import { earnedApi } from "@/api/EarnedApi";
import { checkAuthAction } from "./checkAuth.action";
import { mockUser } from "@/test/fixtures";

vi.mock("@/api/EarnedApi", () => ({
  earnedApi: {
    get: vi.fn(),
  },
}));

describe("checkAuthAction", () => {
  beforeEach(() => {
    vi.mocked(earnedApi.get).mockReset();
    localStorage.clear();
  });

  it("lanza error si no hay token en localStorage", async () => {
    await expect(checkAuthAction()).rejects.toThrow("Not token found");
  });

  it("valida token y actualiza localStorage", async () => {
    localStorage.setItem("token", "old-token");
    const response = { ok: true, user: mockUser, token: "new-token" };
    vi.mocked(earnedApi.get).mockResolvedValue({ data: response });

    await expect(checkAuthAction()).resolves.toEqual(response);
    expect(localStorage.getItem("token")).toBe("new-token");
    expect(earnedApi.get).toHaveBeenCalledWith("auth/validator");
  });

  it("elimina token y lanza error si la validación falla", async () => {
    localStorage.setItem("token", "expired-token");
    vi.mocked(earnedApi.get).mockRejectedValue(new Error("Unauthorized"));

    await expect(checkAuthAction()).rejects.toThrow("Token expted or not valid");
    expect(localStorage.getItem("token")).toBeNull();
  });
});
