import { beforeEach, describe, expect, it, vi } from "vitest";
import { earnedApi } from "@/api/EarnedApi";
import { registerAction } from "./register.action";
import { mockUser } from "@/test/fixtures";

vi.mock("@/api/EarnedApi", () => ({
  earnedApi: {
    post: vi.fn(),
  },
}));

describe("registerAction", () => {
  beforeEach(() => {
    vi.mocked(earnedApi.post).mockReset();
  });

  it("registra un usuario y retorna token", async () => {
    const response = { ok: true, user: mockUser, token: "token-abc" };
    vi.mocked(earnedApi.post).mockResolvedValue({ data: response });

    await expect(
      registerAction("new@example.com", "password", "Nuevo Usuario"),
    ).resolves.toEqual(response);

    expect(earnedApi.post).toHaveBeenCalledWith("auth/register", {
      email: "new@example.com",
      password: "password",
      name: "Nuevo Usuario",
    });
  });

  it("propaga errores de registro", async () => {
    vi.mocked(earnedApi.post).mockRejectedValue(new Error("Email ya registrado"));

    await expect(
      registerAction("new@example.com", "password", "Nuevo Usuario"),
    ).rejects.toThrow("Email ya registrado");
  });
});
