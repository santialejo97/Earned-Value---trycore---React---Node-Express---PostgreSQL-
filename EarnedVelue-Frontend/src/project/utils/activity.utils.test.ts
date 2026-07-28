import { describe, expect, it } from "vitest";
import {
  calculateProjectEarnedValueMetrics,
  createEmptyActivity,
  normalizeActivity,
  sumActivityMetrics,
  toActivityFormValues,
  toActivityPayload,
} from "./activity.utils";
import { createMockActivity } from "@/test/fixtures";

describe("sumActivityMetrics", () => {
  it("suma métricas de múltiples actividades", () => {
    const activities = [
      createMockActivity({
        budgetCompletion: 1000,
        percentagePlanned: 50,
        percentageCompleted: 40,
        actualCost: 200,
      }),
      createMockActivity({
        id_activity: "act-2",
        budgetCompletion: 500,
        percentagePlanned: 30,
        percentageCompleted: 20,
        actualCost: 100,
      }),
    ];

    expect(sumActivityMetrics(activities)).toEqual({
      budgetCompletion: 1500,
      percentagePlanned: 80,
      percentageCompleted: 60,
      actualCost: 300,
    });
  });

  it("retorna ceros para lista vacía", () => {
    expect(sumActivityMetrics([])).toEqual({
      budgetCompletion: 0,
      percentagePlanned: 0,
      percentageCompleted: 0,
      actualCost: 0,
    });
  });

  it("trata valores inválidos como cero", () => {
    const activity = createMockActivity({
      budgetCompletion: "abc" as unknown as number,
      percentagePlanned: null as unknown as number,
    });

    expect(sumActivityMetrics([activity])).toEqual({
      budgetCompletion: 0,
      percentagePlanned: 0,
      percentageCompleted: 40,
      actualCost: 300,
    });
  });
});

describe("calculateProjectEarnedValueMetrics", () => {
  it("calcula métricas EVM correctamente", () => {
    const activities = [
      createMockActivity({
        budgetCompletion: 1000,
        percentagePlanned: 50,
        percentageCompleted: 40,
        actualCost: 300,
      }),
    ];

    const metrics = calculateProjectEarnedValueMetrics(activities);

    expect(metrics.budgetAtCompletion).toBe(1000);
    expect(metrics.plannedValue).toBe(500);
    expect(metrics.earnedValue).toBe(400);
    expect(metrics.actualCost).toBe(300);
    expect(metrics.costVariance).toBe(100);
    expect(metrics.scheduleVariance).toBe(-100);
    expect(metrics.costPerformanceIndex).toBeCloseTo(1.333, 2);
    expect(metrics.schedulePerformanceIndex).toBe(0.8);
    expect(metrics.estimateAtCompletion).toBeCloseTo(750, 2);
    expect(metrics.varianceAtCompletion).toBeCloseTo(250, 2);
  });

  it("retorna índices en cero cuando no hay costos ni valor planificado", () => {
    const activities = [
      createMockActivity({
        budgetCompletion: 0,
        percentagePlanned: 0,
        percentageCompleted: 0,
        actualCost: 0,
      }),
    ];

    const metrics = calculateProjectEarnedValueMetrics(activities);

    expect(metrics.costPerformanceIndex).toBe(0);
    expect(metrics.schedulePerformanceIndex).toBe(0);
    expect(metrics.estimateAtCompletion).toBe(0);
  });
});

describe("normalizeActivity", () => {
  it("normaliza fechas y números", () => {
    const activity = createMockActivity({
      startDate: "2024-01-01",
      endDate: "2024-06-01",
      budgetCompletion: "1000" as unknown as number,
    });

    const normalized = normalizeActivity(activity);

    expect(normalized.startDate).toBeInstanceOf(Date);
    expect(normalized.budgetCompletion).toBe(1000);
  });

  it("usa valores por defecto cuando faltan datos", () => {
    const activity = createMockActivity({
      name: undefined as unknown as string,
      description: undefined as unknown as string,
      startDate: undefined as unknown as Date,
      percentageCompleted: undefined as unknown as number,
    });

    const normalized = normalizeActivity(activity);

    expect(normalized.startDate).toBeInstanceOf(Date);
    expect(normalized.percentageCompleted).toBe(0);
  });
});

describe("createEmptyActivity", () => {
  it("crea una actividad vacía para un proyecto", () => {
    const activity = createEmptyActivity("proj-99");

    expect(activity.id_activity).toBe("new");
    expect(activity.id_project).toBe("proj-99");
    expect(activity.status).toBe("pending");
  });
});

describe("toActivityFormValues", () => {
  it("convierte actividad existente a valores de formulario", () => {
    const activity = createMockActivity({ id_activity: "act-1" });
    const values = toActivityFormValues(activity);

    expect(values.name).toBe(activity.name);
    expect(values.budgetCompletion).toBe(1000);
    expect(values.startDate).toBeInstanceOf(Date);
  });

  it("conserva ceros en actividad existente con presupuesto en cero", () => {
    const activity = createMockActivity({
      id_activity: "act-2",
      budgetCompletion: 0,
      percentagePlanned: 0,
    });
    const values = toActivityFormValues(activity);

    expect(values.budgetCompletion).toBe(0);
    expect(values.percentagePlanned).toBe(0);
  });

  it("usa campos vacíos para actividad nueva", () => {
    const activity = createEmptyActivity("proj-1");
    const values = toActivityFormValues(activity);

    expect(values.budgetCompletion).toBe("");
    expect(values.percentagePlanned).toBe("");
    expect(values.startDate).toBeUndefined();
  });

  it("aplica valores por defecto en campos opcionales", () => {
    const activity = createMockActivity({
      id_activity: "act-3",
      status: "",
      actualCost: undefined as unknown as number,
    });
    const values = toActivityFormValues(activity);

    expect(values.status).toBe("pending");
    expect(values.actualCost).toBe(0);
  });
});

describe("toActivityPayload", () => {
  it("construye payload válido desde el formulario", () => {
    const activity = createMockActivity();
    const formValues = {
      name: "  Nueva actividad  ",
      description: "  Descripción  ",
      status: "in_progress",
      budgetCompletion: 2000 as const,
      percentagePlanned: 60 as const,
      percentageCompleted: 30 as const,
      actualCost: 500 as const,
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-08-01"),
    };

    const payload = toActivityPayload(formValues, activity);

    expect(payload.name).toBe("Nueva actividad");
    expect(payload.description).toBe("Descripción");
    expect(payload.budgetCompletion).toBe(2000);
    expect(payload.status).toBe("in_progress");
  });

  it("lanza error si el formulario está incompleto", () => {
    const activity = createMockActivity();

    expect(() =>
      toActivityPayload(
        {
          name: "Test",
          description: "Desc",
          status: "pending",
          budgetCompletion: "",
          percentagePlanned: 50,
          percentageCompleted: 0,
          actualCost: 0,
        },
        activity,
      ),
    ).toThrow("Formulario de actividad incompleto");

    expect(() =>
      toActivityPayload(
        {
          name: "Test",
          description: "Desc",
          status: "pending",
          budgetCompletion: 100,
          percentagePlanned: 50,
          percentageCompleted: 0,
          actualCost: 0,
          startDate: new Date("2024-01-01"),
        },
        activity,
      ),
    ).toThrow("Formulario de actividad incompleto");

    expect(() =>
      toActivityPayload(
        {
          name: "Test",
          description: "Desc",
          status: "pending",
          budgetCompletion: 100,
          percentagePlanned: "",
          percentageCompleted: 0,
          actualCost: 0,
          startDate: new Date("2024-01-01"),
          endDate: new Date("2024-06-01"),
        },
        activity,
      ),
    ).toThrow("Formulario de actividad incompleto");
  });
});
