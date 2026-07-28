import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { CustomerModal } from "./CustomerModalDelete";

vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({
    open,
    onOpenChange,
    children,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
  }) =>
    open ? (
      <div>
        {children}
        <button type="button" onClick={() => onOpenChange(false)}>
          Cerrar dialog
        </button>
      </div>
    ) : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogClose: ({ render }: { render: React.ReactElement }) => render,
}));

describe("CustomerModal", () => {
  it("confirma eliminación y cierra modal", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const onClose = vi.fn();

    render(
      <CustomerModal
        open
        id="proj-1"
        title="Eliminar proyecto"
        onClose={onClose}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText("Eliminar proyecto")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(onDelete).toHaveBeenCalledWith("proj-1");
    expect(onClose).toHaveBeenCalled();
  });

  it("usa título por defecto", () => {
    render(
      <CustomerModal open id="proj-1" onClose={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.getByText("Confirmar eliminación")).toBeInTheDocument();
  });

  it("cierra modal al cambiar estado del dialog", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <CustomerModal open id="proj-1" onClose={onClose} onDelete={vi.fn()} />,
    );

    await user.click(screen.getByRole("button", { name: "Cerrar dialog" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("no renderiza contenido cuando está cerrado", () => {
    render(
      <CustomerModal open={false} id="proj-1" onClose={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.queryByText("Confirmar eliminación")).not.toBeInTheDocument();
  });
});
