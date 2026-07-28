import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  useActivity,
  useActivityList,
  useDeleteActivity,
} from "./useActivity";
import { activitiesListAction } from "../actions/activitiesList.action";
import { getActivityByIdAction } from "../actions/getActivityById.action";
import { createOrUpdateActivityAction } from "../actions/createOrUpdateActivity.action";
import { deleteActivityAction } from "../actions/deleteActivity.action";
import { createMockActivity } from "@/test/fixtures";
import { createQueryWrapper } from "@/test/test-utils";

vi.mock("../actions/activitiesList.action", () => ({
  activitiesListAction: vi.fn(),
}));

vi.mock("../actions/getActivityById.action", () => ({
  getActivityByIdAction: vi.fn(),
}));

vi.mock("../actions/createOrUpdateActivity.action", () => ({
  createOrUpdateActivityAction: vi.fn(),
}));

vi.mock("../actions/deleteActivity.action", () => ({
  deleteActivityAction: vi.fn(),
}));

describe("useActivityList", () => {
  it("obtiene actividades del proyecto", async () => {
    const activities = [createMockActivity()];
    vi.mocked(activitiesListAction).mockResolvedValue({ ok: true, activities });

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useActivityList("proj-1"), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.activities).toHaveLength(1);
  });
});

describe("useActivity", () => {
  it("no consulta actividad nueva", () => {
    const { Wrapper } = createQueryWrapper();
    renderHook(() => useActivity("new", "proj-1"), { wrapper: Wrapper });

    expect(getActivityByIdAction).not.toHaveBeenCalled();
  });

  it("obtiene actividad por id", async () => {
    const activity = createMockActivity();
    vi.mocked(getActivityByIdAction).mockResolvedValue(activity);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useActivity("act-1", "proj-1"), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.id_activity).toBe("act-1");
  });

  it("guarda actividad e invalida cache", async () => {
    const activity = createMockActivity();
    vi.mocked(getActivityByIdAction).mockResolvedValue(activity);
    vi.mocked(createOrUpdateActivityAction).mockResolvedValue(activity);

    const { Wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useActivity("act-1", "proj-1"), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    await result.current.mutation.mutateAsync(activity);

    expect(createOrUpdateActivityAction).toHaveBeenCalledWith(activity, "proj-1");
    expect(invalidateSpy).toHaveBeenCalled();
  });

  it("respeta opción enabled", () => {
    const { Wrapper } = createQueryWrapper();
    renderHook(() => useActivity("act-1", "proj-1", { enabled: false }), {
      wrapper: Wrapper,
    });

    expect(getActivityByIdAction).not.toHaveBeenCalled();
  });

  it("no consulta si el id de actividad está vacío", () => {
    const { Wrapper } = createQueryWrapper();
    renderHook(() => useActivity("", "proj-1"), { wrapper: Wrapper });

    expect(getActivityByIdAction).not.toHaveBeenCalled();
  });
});

describe("useDeleteActivity", () => {
  it("elimina actividad e invalida cache", async () => {
    vi.mocked(deleteActivityAction).mockResolvedValue({ ok: true, msg: "deleted" });

    const { Wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteActivity("proj-1"), { wrapper: Wrapper });

    await result.current.mutation.mutateAsync("act-1");

    expect(deleteActivityAction).toHaveBeenCalledWith("act-1", expect.anything());
    expect(invalidateSpy).toHaveBeenCalled();
  });
});
