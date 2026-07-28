import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { CustomerHeader } from "./CustomerHeader";
import { useAuthStore } from "@/auth/store/auth.store";
import { mockUser } from "@/test/fixtures";
import { MemoryRouter } from "react-router";

vi.mock("@/components/ui/sidebar", () => ({
  SidebarTrigger: () => <button type="button">Menu</button>,
}));

describe("CustomerHeader", () => {
  it("muestra nombre del usuario autenticado", () => {
    useAuthStore.setState({
      authStatus: "authenticated",
      user: mockUser,
      token: "token",
    });

    render(
      <MemoryRouter>
        <CustomerHeader />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Bienvenido Test User/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cerrar sesion" })).toBeInTheDocument();
  });

  it("muestra botón de login si no está autenticado", () => {
    useAuthStore.setState({
      authStatus: "not-authenticated",
      user: null,
      token: null,
    });

    render(
      <MemoryRouter>
        <CustomerHeader />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(screen.queryByText(/Bienvenido/)).not.toBeInTheDocument();
  });

  it("no muestra saludo si el usuario no tiene nombre", () => {
    useAuthStore.setState({
      authStatus: "authenticated",
      user: { ...mockUser, name: "" },
      token: "token",
    });

    render(
      <MemoryRouter>
        <CustomerHeader />
      </MemoryRouter>,
    );

    expect(screen.queryByText(/Bienvenido/)).not.toBeInTheDocument();
  });

  it("cierra sesión al hacer click", async () => {
    const user = userEvent.setup();
    const logoutSpy = vi.spyOn(useAuthStore.getState(), "logout");

    useAuthStore.setState({
      authStatus: "authenticated",
      user: mockUser,
      token: "token",
    });

    render(
      <MemoryRouter>
        <CustomerHeader />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Cerrar sesion" }));
    expect(logoutSpy).toHaveBeenCalled();
  });
});
