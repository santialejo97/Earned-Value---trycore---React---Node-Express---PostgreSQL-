import { beforeEach, describe, expect, it, vi } from "vitest";
import { earnedApi } from "@/api/EarnedApi";
import { loginAction } from "./login.action";
import { mockUser } from "@/test/fixtures";

vi.mock("@/api/EarnedApi", () => ({
  earnedApi: {
    post: vi.fn(),
  },
}));

describe("loginAction", () => {
  beforeEach(() => {
    vi.mocked(earnedApi.post).mockReset();
  });

  it("retorna datos de autenticación exitosa", async () => {
    const response = { ok: true, user: mockUser, token: "token-123" };
    vi.mocked(earnedApi.post).mockResolvedValue({ data: response });

    await expect(loginAction("test@example.com", "secret")).resolves.toEqual(response);
    expect(earnedApi.post).toHaveBeenCalledWith("auth/login", {
      email: "test@example.com",
      password: "secret",
    });
  });

  it("propaga errores de la API", async () => {
    const error = new Error("Credenciales inválidas");
    vi.mocked(earnedApi.post).mockRejectedValue(error);

    await expect(loginAction("test@example.com", "wrong")).rejects.toThrow(
      "Credenciales inválidas",
    );
  });
});
