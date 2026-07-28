import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { ActivityGrid } from "./ActivityGrid";
import { createMockActivity } from "@/test/fixtures";

const mutate = vi.fn();

vi.mock("../hooks/useActivity", () => ({
  useDeleteActivity: () => ({
    mutation: { mutate },
  }),
}));

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
        Eliminar actividad
      </button>
    </div>
  ),
}));

describe("ActivityGrid", () => {
  it("renderiza actividades y permite eliminar", async () => {
    const user = userEvent.setup();
    const activities = [createMockActivity({ name: "Actividad A" })];

    render(
      <MemoryRouter initialEntries={["/?id_project=proj-1"]}>
        <Routes>
          <Route path="/" element={<ActivityGrid activities={activities} />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Actividad A")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Eliminar actividad" }));
    expect(mutate).toHaveBeenCalledWith("act-1");
  });

  it("renderiza actividades sin id_user definido", () => {
    const activities = [
      createMockActivity({
        name: "Sin usuario",
        id_user: undefined as unknown as string,
      }),
    ];

    render(
      <MemoryRouter initialEntries={["/?id_project=proj-1"]}>
        <Routes>
          <Route path="/" element={<ActivityGrid activities={activities} />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Sin usuario")).toBeInTheDocument();
  });

  it("funciona sin id_project en query params", async () => {
    const user = userEvent.setup();
    const activities = [createMockActivity({ name: "Sin query" })];

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<ActivityGrid activities={activities} />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Eliminar actividad" }));
    expect(mutate).toHaveBeenCalledWith("act-1");
  });
});
