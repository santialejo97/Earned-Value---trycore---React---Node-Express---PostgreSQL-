import { beforeEach, describe, expect, it, vi } from "vitest";
import { earnedApi } from "@/api/EarnedApi";
import { activitiesListAction } from "./activitiesList.action";
import { createMockActivity } from "@/test/fixtures";

vi.mock("@/api/EarnedApi", () => ({
  earnedApi: {
    get: vi.fn(),
  },
}));

describe("activitiesListAction", () => {
  beforeEach(() => {
    vi.mocked(earnedApi.get).mockReset();
  });

  it("lanza error si no hay id de proyecto", async () => {
    await expect(activitiesListAction("")).rejects.toThrow("The id_project is required");
  });

  it("retorna actividades normalizadas", async () => {
    const rawActivity = createMockActivity({ startDate: "2024-01-01" });
    vi.mocked(earnedApi.get).mockResolvedValue({
      data: { ok: true, activities: [rawActivity] },
    });

    const result = await activitiesListAction("proj-1");

    expect(result.ok).toBe(true);
    expect(result.activities[0].startDate).toBeInstanceOf(Date);
    expect(earnedApi.get).toHaveBeenCalledWith("activities/list/proj-1");
  });

  it("propaga errores de la API", async () => {
    vi.mocked(earnedApi.get).mockRejectedValue(new Error("Network error"));

    await expect(activitiesListAction("proj-1")).rejects.toThrow("Network error");
  });
});