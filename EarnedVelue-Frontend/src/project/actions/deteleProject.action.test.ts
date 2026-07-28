import { beforeEach, describe, expect, it, vi } from "vitest";
import { earnedApi } from "@/api/EarnedApi";
import { deleteProjectAction } from "./deteleProject.action";

vi.mock("@/api/EarnedApi", () => ({
  earnedApi: {
    delete: vi.fn(),
  },
}));

describe("deleteProjectAction", () => {
  beforeEach(() => {
    vi.mocked(earnedApi.delete).mockReset();
  });

  it("lanza error si no hay id", async () => {
    await expect(deleteProjectAction("")).rejects.toThrow("ID is required");
  });

  it("elimina proyecto correctamente", async () => {
    vi.mocked(earnedApi.delete).mockResolvedValue({
      data: { ok: true, msg: "deleted" },
    });

    const result = await deleteProjectAction("proj-1");

    expect(result.ok).toBe(true);
    expect(earnedApi.delete).toHaveBeenCalledWith("project/delete/proj-1");
  });

  it("propaga errores de eliminación", async () => {
    vi.mocked(earnedApi.delete).mockRejectedValue(new Error("Delete failed"));

    await expect(deleteProjectAction("proj-1")).rejects.toThrow("Delete failed");
  });
});
