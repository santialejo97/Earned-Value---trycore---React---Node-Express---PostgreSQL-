import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import {
  AuthenticatedRoute,
  NotAuthenticatedRoute,
} from "./ProtectedRoutes";
import { useAuthStore } from "@/auth/store/auth.store";

const ProtectedContent = () => <div>Contenido protegido</div>;
const PublicContent = () => <div>Contenido público</div>;

describe("ProtectedRoutes", () => {
  it("AuthenticatedRoute redirige a login si no está autenticado", () => {
    useAuthStore.setState({ authStatus: "not-authenticated", user: null, token: null });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <AuthenticatedRoute>
                <ProtectedContent />
              </AuthenticatedRoute>
            }
          />
          <Route path="/auth/login" element={<div>Página login</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Página login")).toBeInTheDocument();
  });

  it("AuthenticatedRoute muestra contenido si está autenticado", () => {
    useAuthStore.setState({ authStatus: "authenticated", user: null, token: "token" });

    render(
      <MemoryRouter>
        <AuthenticatedRoute>
          <ProtectedContent />
        </AuthenticatedRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText("Contenido protegido")).toBeInTheDocument();
  });

  it("AuthenticatedRoute no renderiza nada mientras verifica", () => {
    useAuthStore.setState({ authStatus: "checking", user: null, token: null });

    const { container } = render(
      <MemoryRouter>
        <AuthenticatedRoute>
          <ProtectedContent />
        </AuthenticatedRoute>
      </MemoryRouter>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("NotAuthenticatedRoute redirige si ya está autenticado", () => {
    useAuthStore.setState({ authStatus: "authenticated", user: null, token: "token" });

    render(
      <MemoryRouter initialEntries={["/auth/login"]}>
        <Routes>
          <Route
            path="/auth/login"
            element={
              <NotAuthenticatedRoute>
                <PublicContent />
              </NotAuthenticatedRoute>
            }
          />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("NotAuthenticatedRoute no renderiza nada mientras verifica", () => {
    useAuthStore.setState({ authStatus: "checking", user: null, token: null });

    const { container } = render(
      <MemoryRouter>
        <NotAuthenticatedRoute>
          <PublicContent />
        </NotAuthenticatedRoute>
      </MemoryRouter>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("NotAuthenticatedRoute muestra contenido si no está autenticado", () => {
    useAuthStore.setState({ authStatus: "not-authenticated", user: null, token: null });

    render(
      <MemoryRouter>
        <NotAuthenticatedRoute>
          <PublicContent />
        </NotAuthenticatedRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText("Contenido público")).toBeInTheDocument();
  });
});
