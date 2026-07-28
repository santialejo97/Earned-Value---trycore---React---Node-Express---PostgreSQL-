import { beforeEach, describe, expect, it, vi } from "vitest";
import { earnedApi } from "@/api/EarnedApi";
import { getActivityByIdAction } from "./getActivityById.action";
import { createMockActivity } from "@/test/fixtures";

vi.mock("@/api/EarnedApi", () => ({
  earnedApi: {
    get: vi.fn(),
  },
}));

describe("getActivityByIdAction", () => {
  beforeEach(() => {
    vi.mocked(earnedApi.get).mockReset();
  });

  it("lanza error si no hay id", async () => {
    await expect(getActivityByIdAction("")).rejects.toThrow("ID is required");
  });

  it("retorna actividad vacía para id new", async () => {
    const activity = await getActivityByIdAction("new");

    expect(activity.id_activity).toBe("new");
    expect(earnedApi.get).not.toHaveBeenCalled();
  });

  it("obtiene y normaliza actividad existente", async () => {
    const rawActivity = createMockActivity({ startDate: "2024-03-01" });
    vi.mocked(earnedApi.get).mockResolvedValue({
      data: { ok: true, activity: rawActivity },
    });

    const activity = await getActivityByIdAction("act-1");

    expect(activity.startDate).toBeInstanceOf(Date);
    expect(earnedApi.get).toHaveBeenCalledWith("activities/act-1");
  });

  it("propaga errores de la API", async () => {
    vi.mocked(earnedApi.get).mockRejectedValue(new Error("Not found"));

    await expect(getActivityByIdAction("act-1")).rejects.toThrow("Not found");
  });
});
