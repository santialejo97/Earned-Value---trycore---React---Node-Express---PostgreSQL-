import { beforeEach, describe, expect, it, vi } from "vitest";
import { earnedApi } from "@/api/EarnedApi";
import { createOrUpdateActivityAction } from "./createOrUpdateActivity.action";
import { createMockActivity } from "@/test/fixtures";

vi.mock("@/api/EarnedApi", () => ({
  earnedApi: vi.fn(),
}));

describe("createOrUpdateActivityAction", () => {
  beforeEach(() => {
    vi.mocked(earnedApi).mockReset();
  });

  it("crea una actividad nueva", async () => {
    const activity = createMockActivity({ id_activity: "new" });
    const savedActivity = createMockActivity({ id_activity: "act-created" });

    vi.mocked(earnedApi).mockResolvedValue({
      data: { ok: true, msg: "created", activity: savedActivity },
    });

    const result = await createOrUpdateActivityAction(activity, "proj-1");

    expect(result.id_activity).toBe("act-created");
    expect(earnedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "activities/create/proj-1",
        method: "POST",
      }),
    );
  });

  it("actualiza una actividad existente", async () => {
    const activity = createMockActivity({ id_activity: "act-1" });

    vi.mocked(earnedApi).mockResolvedValue({
      data: { ok: true, msg: "updated", activity },
    });

    await createOrUpdateActivityAction(activity, "proj-1");

    expect(earnedApi).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "activities/edit/act-1",
        method: "PATCH",
      }),
    );
  });

  it("lanza error si las fechas son inválidas", async () => {
    const activity = createMockActivity({
      startDate: "invalid-date" as unknown as Date,
    });

    await expect(createOrUpdateActivityAction(activity, "proj-1")).rejects.toThrow(
      "Las fechas de inicio y fin son inválidas",
    );
  });
});
