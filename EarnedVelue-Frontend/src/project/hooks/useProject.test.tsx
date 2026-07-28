import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useProject, useProjectList, useDeleteProject } from "./useProject";
import { projectListAction } from "../actions/projectList.action";
import { getProjectByIdAction } from "../actions/getProjectById.action";
import { createOrUpdateProjectAction } from "../actions/createOrUpdateProject.action";
import { deleteProjectAction } from "../actions/deteleProject.action";
import { createMockProject } from "@/test/fixtures";
import { createQueryWrapper } from "@/test/test-utils";

vi.mock("../actions/projectList.action", () => ({
  projectListAction: vi.fn(),
}));

vi.mock("../actions/getProjectById.action", () => ({
  getProjectByIdAction: vi.fn(),
}));

vi.mock("../actions/createOrUpdateProject.action", () => ({
  createOrUpdateProjectAction: vi.fn(),
}));

vi.mock("../actions/deteleProject.action", () => ({
  deleteProjectAction: vi.fn(),
}));

describe("useProjectList", () => {
  it("obtiene lista de proyectos", async () => {
    const projects = [createMockProject()];
    vi.mocked(projectListAction).mockResolvedValue({ ok: true, projects });

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useProjectList("user-1"), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.projects).toHaveLength(1);
  });
});

describe("useProject", () => {
  it("obtiene proyecto por id", async () => {
    const project = createMockProject();
    vi.mocked(getProjectByIdAction).mockResolvedValue(project);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useProject("proj-1"), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.id).toBe("proj-1");
  });

  it("expone mutación para crear o actualizar", async () => {
    const project = createMockProject();
    vi.mocked(getProjectByIdAction).mockResolvedValue(project);
    vi.mocked(createOrUpdateProjectAction).mockResolvedValue(project);

    const { Wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useProject("proj-1"), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    await result.current.mutation.mutateAsync(project);

    expect(createOrUpdateProjectAction).toHaveBeenCalledWith(
      project,
      expect.anything(),
    );
    expect(invalidateSpy).toHaveBeenCalled();
  });
});

describe("useDeleteProject", () => {
  it("elimina proyecto e invalida cache", async () => {
    vi.mocked(deleteProjectAction).mockResolvedValue({ ok: true, msg: "deleted" });

    const { Wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteProject(), { wrapper: Wrapper });

    await result.current.mutation.mutateAsync("proj-1");

    expect(deleteProjectAction).toHaveBeenCalledWith("proj-1", expect.anything());
    expect(invalidateSpy).toHaveBeenCalled();
  });
});
