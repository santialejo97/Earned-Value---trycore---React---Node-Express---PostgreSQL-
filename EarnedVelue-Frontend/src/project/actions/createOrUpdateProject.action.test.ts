import { beforeEach, describe, expect, it, vi } from "vitest";
import { earnedApi } from "@/api/EarnedApi";
import { createOrUpdateProjectAction } from "./createOrUpdateProject.action";
import { createMockProject } from "@/test/fixtures";

vi.mock("@/api/EarnedApi", () => ({
  earnedApi: vi.fn(),
}));

describe("createOrUpdateProjectAction", () => {
  beforeEach(() => {
    vi.mocked(earnedApi).mockReset();
  });

  it("crea un proyecto nuevo", async () => {
    const project = createMockProject({ id: "new" });
    const savedProject = createMockProject({ id: "proj-created" });

    vi.mocked(earnedApi).mockResolvedValue({
      data: { ok: true, msg: "created", project: savedProject },
    });

    const result = await createOrUpdateProjectAction(project);

    expect(result.id).toBe("proj-created");
    expect(earnedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "project/create",
        method: "POST",
      }),
    );
  });

  it("actualiza un proyecto existente", async () => {
    const project = createMockProject({ id: "proj-1" });

    vi.mocked(earnedApi).mockResolvedValue({
      data: { ok: true, msg: "updated", project },
    });

    await createOrUpdateProjectAction(project);

    expect(earnedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "project/edit/proj-1",
        method: "PATCH",
      }),
    );
  });
});
