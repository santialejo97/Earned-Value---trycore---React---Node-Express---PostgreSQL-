import { beforeEach, describe, expect, it, vi } from "vitest";
import { earnedApi } from "@/api/EarnedApi";
import { projectListAction } from "./projectList.action";
import { createMockProject } from "@/test/fixtures";

vi.mock("@/api/EarnedApi", () => ({
  earnedApi: {
    get: vi.fn(),
  },
}));

describe("projectListAction", () => {
  beforeEach(() => {
    vi.mocked(earnedApi.get).mockReset();
  });

  it("retorna lista de proyectos", async () => {
    const projects = [createMockProject()];
    vi.mocked(earnedApi.get).mockResolvedValue({
      data: { ok: true, projects },
    });

    const result = await projectListAction();

    expect(result.projects).toHaveLength(1);
    expect(earnedApi.get).toHaveBeenCalledWith("project/list");
  });

  it("propaga errores", async () => {
    vi.mocked(earnedApi.get).mockRejectedValue(new Error("Server error"));

    await expect(projectListAction()).rejects.toThrow("Server error");
  });
});
