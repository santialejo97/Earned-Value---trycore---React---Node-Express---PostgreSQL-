import { beforeEach, describe, expect, it, vi } from "vitest";
import { earnedApi } from "@/api/EarnedApi";
import { getProjectByIdAction } from "./getProjectById.action";
import { createMockProject } from "@/test/fixtures";

vi.mock("@/api/EarnedApi", () => ({
  earnedApi: {
    get: vi.fn(),
  },
}));

describe("getProjectByIdAction", () => {
  beforeEach(() => {
    vi.mocked(earnedApi.get).mockReset();
  });

  it("lanza error si no hay id", async () => {
    await expect(getProjectByIdAction("")).rejects.toThrow("ID is required");
  });

  it("retorna proyecto vacío para id new", async () => {
    const project = await getProjectByIdAction("new");

    expect(project.id).toBe("new");
    expect(project.name).toBe("");
    expect(earnedApi.get).not.toHaveBeenCalled();
  });

  it("obtiene proyecto existente", async () => {
    const mockProject = createMockProject();
    vi.mocked(earnedApi.get).mockResolvedValue({
      data: { ok: true, project: mockProject },
    });

    const project = await getProjectByIdAction("proj-1");

    expect(project).toEqual(mockProject);
    expect(earnedApi.get).toHaveBeenCalledWith("project/proj-1");
  });

  it("propaga errores de la API", async () => {
    vi.mocked(earnedApi.get).mockRejectedValue(new Error("Not found"));

    await expect(getProjectByIdAction("proj-1")).rejects.toThrow("Not found");
  });
});
