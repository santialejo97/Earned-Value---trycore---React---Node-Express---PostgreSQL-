import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useProjectMetric } from "./useProjectMetric";
import { activitiesListAction } from "../actions/activitiesList.action";
import { createMockActivity } from "@/test/fixtures";
import { createQueryWrapper } from "@/test/test-utils";

vi.mock("../actions/activitiesList.action", () => ({
  activitiesListAction: vi.fn(),
}));

describe("useProjectMetric", () => {
  it("no consulta métricas para proyecto nuevo", () => {
    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useProjectMetric("new"), { wrapper: Wrapper });

    expect(result.current.isShowEarnedValue).toBe(false);
    expect(activitiesListAction).not.toHaveBeenCalled();
  });

  it("calcula métricas cuando hay actividades", async () => {
    const activities = [
      createMockActivity({
        budgetCompletion: 1000,
        percentagePlanned: 50,
        percentageCompleted: 40,
        actualCost: 300,
      }),
    ];

    vi.mocked(activitiesListAction).mockResolvedValue({
      ok: true,
      activities,
    });

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useProjectMetric("proj-1"), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.isShowEarnedValue).toBe(true);
    });

    expect(result.current.projectEarnedValueMetrics.earnedValue).toBe(400);
    expect(result.current.activityMetricsTotals.budgetCompletion).toBe(1000);
  });

  it("no muestra métricas si hay error", async () => {
    vi.mocked(activitiesListAction).mockRejectedValue(new Error("Error"));

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useProjectMetric("proj-1"), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.isShowEarnedValue).toBe(false);
  });

  it("retorna totales vacíos si no hay actividades", async () => {
    vi.mocked(activitiesListAction).mockResolvedValue({
      ok: true,
      activities: [],
    });

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useProjectMetric("proj-1"), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isShowEarnedValue).toBe(false);
    expect(result.current.activityMetricsTotals.actualCost).toBe(0);
  });

  it("no consulta si el id de proyecto está vacío", () => {
    const { Wrapper } = createQueryWrapper();
    renderHook(() => useProjectMetric(""), { wrapper: Wrapper });

    expect(activitiesListAction).not.toHaveBeenCalled();
  });
});
