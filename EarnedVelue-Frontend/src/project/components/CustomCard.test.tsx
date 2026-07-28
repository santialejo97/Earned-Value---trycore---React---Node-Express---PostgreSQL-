import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { CustomCard } from "./CustomCard";
import { useAuthStore } from "@/auth/store/auth.store";
import { createMockActivity, createMockProject, mockUser } from "@/test/fixtures";

const mockNavigate = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("./CustomerModalDelete", () => ({
  CustomerModal: ({
    open,
    title,
    onDelete,
    id,
  }: {
    open: boolean;
    title: string;
    onDelete: (id: string) => void;
    id: string;
  }) =>
    open ? (
      <div>
        <span>{title}</span>
        <button type="button" onClick={() => onDelete(id)}>
          Confirmar eliminación
        </button>
      </div>
    ) : null,
}));

vi.mock("./CustomerModelActivity", () => ({
  CustomerModelActivity: ({
    open,
    onClose,
  }: {
    open: boolean;
    onClose: () => void;
  }) =>
    open ? (
      <div>
        <span>Modal actividad</span>
        <button type="button" onClick={onClose}>
          Cerrar modal actividad
        </button>
      </div>
    ) : null,
}));

describe("CustomCard", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    useAuthStore.setState({
      authStatus: "authenticated",
      user: mockUser,
      token: "token",
    });
  });

  it("renderiza tarjeta de proyecto con enlace", () => {
    const project = createMockProject();
    const onDelete = vi.fn();

    render(
      <MemoryRouter>
        <CustomCard
          type="project"
          name={project.name}
          description={project.description}
          status={project.status}
          userId={project.id_user}
          id={project.id}
          dateCreated={project.created_at}
          onDelete={onDelete}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText(project.name)).toBeInTheDocument();
    expect(screen.getByText("Proyecto")).toBeInTheDocument();
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
  });

  it("permite editar proyecto si el usuario es dueño", async () => {
    const user = userEvent.setup();
    const project = createMockProject({ id_user: mockUser.id_user });

    render(
      <MemoryRouter>
        <CustomCard
          type="project"
          name={project.name}
          description={project.description}
          status={project.status}
          userId={project.id_user}
          id={project.id}
          dateCreated={project.created_at}
          onDelete={vi.fn()}
        />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Editar" }));
    expect(mockNavigate).toHaveBeenCalledWith(`/project/edit/${project.id}`);
  });

  it("deshabilita edición de proyecto para usuarios que no son dueños", () => {
    const project = createMockProject({ id_user: "otro-usuario" });

    render(
      <MemoryRouter>
        <CustomCard
          type="project"
          name={project.name}
          description={project.description}
          status={project.status}
          userId={project.id_user}
          id={project.id}
          dateCreated={project.created_at}
          onDelete={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: "Editar" })).toBeDisabled();
  });

  it("abre modal de actividad al hacer click en tarjeta de actividad", async () => {
    const user = userEvent.setup();
    const activity = createMockActivity();

    render(
      <MemoryRouter>
        <CustomCard
          type="activity"
          name={activity.name}
          description={activity.description}
          status={activity.status}
          userId={activity.id_user}
          id={activity.id_activity}
          dateCreated={activity.created_at}
          dateBegin={activity.startDate}
          dateEnd={activity.endDate}
          onDelete={vi.fn()}
          activity={activity}
        />
      </MemoryRouter>,
    );

    const cardButton = screen.getAllByRole("button")[0];
    await user.click(cardButton);
    expect(screen.getByText("Modal actividad")).toBeInTheDocument();
  });

  it("abre modal de edición al editar actividad", async () => {
    const user = userEvent.setup();
    const activity = createMockActivity();

    render(
      <MemoryRouter>
        <CustomCard
          type="activity"
          name={activity.name}
          description={activity.description}
          status={activity.status}
          userId={activity.id_user}
          id={activity.id_activity}
          dateCreated={activity.created_at}
          dateBegin={activity.startDate}
          dateEnd={activity.endDate}
          onDelete={vi.fn()}
          activity={activity}
        />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Editar" }));
    expect(screen.getByText("Modal actividad")).toBeInTheDocument();
  });

  it("abre modal con tecla Enter en tarjeta de actividad", async () => {
    const user = userEvent.setup();
    const activity = createMockActivity();

    render(
      <MemoryRouter>
        <CustomCard
          type="activity"
          name={activity.name}
          description={activity.description}
          status={activity.status}
          userId={activity.id_user}
          id={activity.id_activity}
          dateCreated={activity.created_at}
          dateBegin={activity.startDate}
          dateEnd={activity.endDate}
          onDelete={vi.fn()}
          activity={activity}
        />
      </MemoryRouter>,
    );

    const cardButton = screen.getAllByRole("button")[0];
    cardButton.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByText("Modal actividad")).toBeInTheDocument();
  });

  it("confirma eliminación desde modal", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const project = createMockProject({ id_user: mockUser.id_user });

    render(
      <MemoryRouter>
        <CustomCard
          type="project"
          name={project.name}
          description={project.description}
          status="unknown_status"
          userId={project.id_user}
          id={project.id}
          dateCreated={project.created_at}
          onDelete={onDelete}
        />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Eliminar" }));
    await user.click(screen.getByRole("button", { name: "Confirmar eliminación" }));

    expect(onDelete).toHaveBeenCalledWith(project.id);
  });

  it("cierra modal de actividad", async () => {
    const user = userEvent.setup();
    const activity = createMockActivity();

    render(
      <MemoryRouter>
        <CustomCard
          type="activity"
          name={activity.name}
          description={activity.description}
          status={activity.status}
          userId={activity.id_user}
          id={activity.id_activity}
          dateCreated={activity.created_at}
          dateBegin={activity.startDate}
          dateEnd={activity.endDate}
          onDelete={vi.fn()}
          activity={activity}
        />
      </MemoryRouter>,
    );

    await user.click(screen.getAllByRole("button")[0]);
    expect(screen.getByText("Modal actividad")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cerrar modal actividad" }));
    expect(screen.queryByText("Modal actividad")).not.toBeInTheDocument();
  });
});
