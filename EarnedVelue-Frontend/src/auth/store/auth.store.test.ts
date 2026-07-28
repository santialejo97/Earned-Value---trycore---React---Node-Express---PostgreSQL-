import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "./auth.store";
import { loginAction } from "../actions/login.action";
import { registerAction } from "../actions/register.action";
import { checkAuthAction } from "../actions/checkAuth.action";
import { mockUser } from "@/test/fixtures";

vi.mock("../actions/login.action", () => ({
  loginAction: vi.fn(),
}));

vi.mock("../actions/register.action", () => ({
  registerAction: vi.fn(),
}));

vi.mock("../actions/checkAuth.action", () => ({
  checkAuthAction: vi.fn(),
}));

const resetStore = () => {
  useAuthStore.setState({
    user: null,
    token: null,
    authStatus: "checking",
  });
};

describe("useAuthStore", () => {
  beforeEach(() => {
    resetStore();
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("autentica con login exitoso", async () => {
    vi.mocked(loginAction).mockResolvedValue({
      ok: true,
      user: mockUser,
      token: "token-login",
    });

    const success = await useAuthStore.getState().login("test@example.com", "secret");

    expect(success).toBe(true);
    expect(useAuthStore.getState().authStatus).toBe("authenticated");
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(localStorage.getItem("token")).toBe("token-login");
  });

  it("marca como no autenticado cuando login falla", async () => {
    vi.mocked(loginAction).mockRejectedValue(new Error("Login failed"));

    const success = await useAuthStore.getState().login("test@example.com", "wrong");

    expect(success).toBe(false);
    expect(useAuthStore.getState().authStatus).toBe("not-authenticated");
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("registra usuario exitosamente", async () => {
    vi.mocked(registerAction).mockResolvedValue({
      ok: true,
      user: mockUser,
      token: "token-register",
    });

    const success = await useAuthStore
      .getState()
      .register("new@example.com", "password", "Test User");

    expect(success).toBe(true);
    expect(useAuthStore.getState().authStatus).toBe("authenticated");
    expect(localStorage.getItem("token")).toBe("token-register");
  });

  it("marca como no autenticado cuando registro falla", async () => {
    vi.mocked(registerAction).mockRejectedValue(new Error("Register failed"));

    const success = await useAuthStore
      .getState()
      .register("new@example.com", "password", "Test User");

    expect(success).toBe(false);
    expect(useAuthStore.getState().authStatus).toBe("not-authenticated");
  });

  it("cierra sesión y limpia el token", () => {
    localStorage.setItem("token", "token-logout");
    useAuthStore.setState({
      user: mockUser,
      token: "token-logout",
      authStatus: "authenticated",
    });

    useAuthStore.getState().logout();

    expect(useAuthStore.getState().authStatus).toBe("not-authenticated");
    expect(useAuthStore.getState().user).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("valida sesión existente", async () => {
    vi.mocked(checkAuthAction).mockResolvedValue({
      ok: true,
      user: mockUser,
      token: "token-valid",
    });

    const success = await useAuthStore.getState().checkAuthStatus();

    expect(success).toBe(true);
    expect(useAuthStore.getState().authStatus).toBe("authenticated");
  });

  it("marca como no autenticado si la validación falla", async () => {
    vi.mocked(checkAuthAction).mockRejectedValue(new Error("Invalid token"));

    const success = await useAuthStore.getState().checkAuthStatus();

    expect(success).toBe(false);
    expect(useAuthStore.getState().authStatus).toBe("not-authenticated");
  });
});
