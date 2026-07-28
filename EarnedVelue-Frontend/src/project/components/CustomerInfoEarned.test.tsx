import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CustomerInfoEarned } from "./CustomerInfoEarned";
import type { ActivityMetricsTotals } from "@/type/activities.type";
import type { ProjectEarnedValueMetrics } from "@/type/projects.type";

const projectMetrics: ProjectEarnedValueMetrics = {
  budgetAtCompletion: 1000,
  plannedValue: 500,
  earnedValue: 400,
  actualCost: 300,
  costVariance: 100,
  scheduleVariance: -100,
  costPerformanceIndex: 1.33,
  schedulePerformanceIndex: 0.8,
  estimateAtCompletion: 750,
  varianceAtCompletion: 250,
};

const activityTotals: ActivityMetricsTotals = {
  budgetCompletion: 1000,
  percentagePlanned: 50,
  percentageCompleted: 40,
  actualCost: 300,
};

describe("CustomerInfoEarned", () => {
  it("muestra métricas de valor ganado", () => {
    render(
      <CustomerInfoEarned
        projectEarnedValueMetrics={projectMetrics}
        activityMetricsTotals={activityTotals}
      />,
    );

    expect(screen.getByText("Valor ganado")).toBeInTheDocument();
    expect(screen.getByText(/Presupuesto total \(BAC\)/)).toBeInTheDocument();
    expect(screen.getByText(/Valor planificado \(PV\)/)).toBeInTheDocument();
    expect(screen.getByText(/Valor ganado \(EV\)/)).toBeInTheDocument();
    expect(screen.getByText(/Costo actual \(AC\)/)).toBeInTheDocument();
    expect(screen.getByText(/Suma % planeado/)).toBeInTheDocument();
    expect(screen.getByText(/CPI:/)).toBeInTheDocument();
    expect(screen.getByText(/SPI:/)).toBeInTheDocument();
  });

  it("renderiza valores en cero y negativos", () => {
    render(
      <CustomerInfoEarned
        projectEarnedValueMetrics={{
          ...projectMetrics,
          budgetAtCompletion: 0,
          plannedValue: 0,
          earnedValue: 0,
          actualCost: 0,
          costVariance: -100,
          scheduleVariance: -50,
          costPerformanceIndex: 0,
          schedulePerformanceIndex: 0,
          estimateAtCompletion: 0,
          varianceAtCompletion: 0,
        }}
        activityMetricsTotals={{
          budgetCompletion: 0,
          percentagePlanned: 0,
          percentageCompleted: 0,
          actualCost: 0,
        }}
      />,
    );

    expect(screen.getByText(/CV:/)).toBeInTheDocument();
    expect(screen.getByText(/SV:/)).toBeInTheDocument();
    expect(screen.getAllByText(/0,00/).length).toBeGreaterThanOrEqual(2);
  });
});
