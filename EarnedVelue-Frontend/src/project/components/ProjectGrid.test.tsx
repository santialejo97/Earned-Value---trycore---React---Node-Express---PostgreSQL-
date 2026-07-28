import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectGrid } from "./ProjectGrid";
import { createMockProject } from "@/test/fixtures";
import { MemoryRouter } from "react-router";

vi.mock("./CustomCard", () => ({
  CustomCard: ({
    name,
    onDelete,
    id,
  }: {
    name: string;
    onDelete: (id: string) => void;
    id: string;
  }) => (
    <div>
      <span>{name}</span>
      <button type="button" onClick={() => onDelete(id)}>
        Eliminar
      </button>
    </div>
  ),
}));

describe("ProjectGrid", () => {
  it("renderiza proyectos en grid", () => {
    const projects = [
      createMockProject({ id: "p1", name: "Proyecto 1" }),
      createMockProject({ id: "p2", name: "Proyecto 2", id_user: undefined as unknown as string }),
    ];
    const onDelete = vi.fn();

    render(
      <MemoryRouter>
        <ProjectGrid projects={projects} onDelete={onDelete} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Proyecto 1")).toBeInTheDocument();
    expect(screen.getByText("Proyecto 2")).toBeInTheDocument();
  });
});
