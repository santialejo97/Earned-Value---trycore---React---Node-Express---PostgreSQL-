import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AppSidebar } from "./AppSidebar";

vi.mock("@/components/ui/sidebar", () => ({
  Sidebar: ({ children }: { children: React.ReactNode }) => <aside>{children}</aside>,
  SidebarHeader: ({ children }: { children: React.ReactNode }) => <header>{children}</header>,
  SidebarContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarGroup: ({ children }: { children: React.ReactNode }) => <section>{children}</section>,
  SidebarGroupLabel: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  SidebarGroupContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarMenu: ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
  SidebarMenuButton: ({
    children,
    isActive,
  }: {
    children: React.ReactNode;
    isActive?: boolean;
  }) => <button type="button" data-active={isActive}>{children}</button>,
}));

describe("AppSidebar", () => {
  it("renderiza navegación principal", () => {
    render(
      <MemoryRouter initialEntries={["/projects"]}>
        <AppSidebar />
      </MemoryRouter>,
    );

    expect(screen.getByText("Earned Value")).toBeInTheDocument();
    expect(screen.getByText("Menú")).toBeInTheDocument();
    expect(screen.getByText("Proyectos")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Proyectos/i })).toHaveAttribute(
      "data-active",
      "true",
    );
  });

  it("marca item inactivo en otras rutas", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppSidebar />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: /Proyectos/i })).toHaveAttribute(
      "data-active",
      "false",
    );
  });
});
