import { beforeEach, describe, expect, it, vi } from "vitest";
import { earnedApi } from "@/api/EarnedApi";
import { deleteActivityAction } from "./deleteActivity.action";

vi.mock("@/api/EarnedApi", () => ({
  earnedApi: {
    delete: vi.fn(),
  },
}));

describe("deleteActivityAction", () => {
  beforeEach(() => {
    vi.mocked(earnedApi.delete).mockReset();
  });

  it("lanza error si no hay id", async () => {
    await expect(deleteActivityAction("")).rejects.toThrow("ID is required");
  });

  it("elimina actividad correctamente", async () => {
    vi.mocked(earnedApi.delete).mockResolvedValue({
      data: { ok: true, msg: "deleted" },
    });

    const result = await deleteActivityAction("act-1");

    expect(result.ok).toBe(true);
    expect(earnedApi.delete).toHaveBeenCalledWith("activities/delete/act-1");
  });

  it("propaga errores de eliminación", async () => {
    vi.mocked(earnedApi.delete).mockRejectedValue(new Error("Delete failed"));

    await expect(deleteActivityAction("act-1")).rejects.toThrow("Delete failed");
  });
});
