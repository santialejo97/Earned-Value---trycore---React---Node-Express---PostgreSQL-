import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { CustomerModelActivity } from "./CustomerModelActivity";
import { createMockActivity } from "@/test/fixtures";
import { toast } from "sonner";

const mutateAsync = vi.fn();
const onClose = vi.fn();

vi.mock("../hooks/useActivity", () => ({
  useActivity: vi.fn(),
}));

vi.mock("../pages/ui/ActivityForm", () => ({
  ActivityForm: ({
    onSubmit,
    onClose: closeForm,
  }: {
    onSubmit: (activity: ReturnType<typeof createMockActivity>) => Promise<void>;
    onClose: () => void;
  }) => (
    <div>
      <button type="button" onClick={() => closeForm()}>
        Cerrar formulario
      </button>
      <button
        type="button"
        onClick={() => onSubmit(createMockActivity())}
      >
        Guardar actividad
      </button>
    </div>
  ),
}));

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
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { useActivity } from "../hooks/useActivity";

describe("CustomerModelActivity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useActivity).mockReturnValue({
      data: createMockActivity(),
      isLoading: false,
      mutation: { mutateAsync },
    } as never);
  });

  it("muestra spinner mientras carga", () => {
    vi.mocked(useActivity).mockReturnValue({
      data: undefined,
      isLoading: true,
      mutation: { mutateAsync },
    } as never);

    render(
      <MemoryRouter initialEntries={["/?id_project=proj-1"]}>
        <Routes>
          <Route
            path="/"
            element={
              <CustomerModelActivity
                open
                onClose={onClose}
                activity={createMockActivity()}
                isEdit={false}
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("guarda actividad y cierra modal en éxito", async () => {
    const user = userEvent.setup();
    mutateAsync.mockImplementation((_activity, options) => {
      options?.onSuccess?.();
      return Promise.resolve();
    });

    render(
      <MemoryRouter initialEntries={["/?id_project=proj-1"]}>
        <Routes>
          <Route
            path="/"
            element={
              <CustomerModelActivity
                open
                onClose={onClose}
                activity={createMockActivity()}
                isEdit
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Guardar actividad" }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("muestra error si falla la actualización", async () => {
    const user = userEvent.setup();
    mutateAsync.mockImplementation(async (_activity, options) => {
      options?.onError?.(new Error("fail"));
    });

    render(
      <MemoryRouter initialEntries={["/?id_project=proj-1"]}>
        <Routes>
          <Route
            path="/"
            element={
              <CustomerModelActivity
                open
                onClose={onClose}
                activity={createMockActivity()}
                isEdit
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Guardar actividad" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it("cierra modal desde el dialog", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={
              <CustomerModelActivity
                open
                onClose={onClose}
                activity={createMockActivity({ id_project: "proj-fallback" })}
                isEdit={false}
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Cerrar dialog" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("usa id_project de la actividad si no hay query param", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={
              <CustomerModelActivity
                open
                onClose={onClose}
                activity={createMockActivity({ id_project: "proj-fallback" })}
                isEdit={false}
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(useActivity).toHaveBeenCalledWith(
      "act-1",
      "proj-fallback",
      expect.objectContaining({ enabled: true }),
    );
  });

  it("muestra estado desconocido cuando el status no está mapeado", () => {
    vi.mocked(useActivity).mockReturnValue({
      data: createMockActivity({ status: "custom_status" }),
      isLoading: false,
      mutation: { mutateAsync },
    } as never);

    render(
      <MemoryRouter initialEntries={["/?id_project=proj-1"]}>
        <Routes>
          <Route
            path="/"
            element={
              <CustomerModelActivity
                open
                onClose={onClose}
                activity={createMockActivity({ status: "custom_status" })}
                isEdit={false}
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("custom_status")).toBeInTheDocument();
  });
});
