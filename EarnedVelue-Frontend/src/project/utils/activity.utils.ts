import { toDate } from "@/lib/utils";
import type { Activity, ActivityMetricsTotals } from "@/type/activities.type";
import type { ProjectEarnedValueMetrics } from "@/type/projects.type";

const toMetricNumber = (value: number | string | null | undefined): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const sumActivityMetrics = (activities: Activity[]): ActivityMetricsTotals =>
  activities.reduce(
    (totals, activity) => ({
      budgetCompletion: totals.budgetCompletion + toMetricNumber(activity.budgetCompletion),
      percentagePlanned: totals.percentagePlanned + toMetricNumber(activity.percentagePlanned),
      percentageCompleted: totals.percentageCompleted + toMetricNumber(activity.percentageCompleted),
      actualCost: totals.actualCost + toMetricNumber(activity.actualCost),
    }),
    {
      budgetCompletion: 0,
      percentagePlanned: 0,
      percentageCompleted: 0,
      actualCost: 0,
    },
  );

export const calculateProjectEarnedValueMetrics = (
  activities: Activity[],
): ProjectEarnedValueMetrics => {
  const budgetAtCompletion = activities.reduce(
    (sum, activity) => sum + toMetricNumber(activity.budgetCompletion),
    0,
  );
  const plannedValue = activities.reduce(
    (sum, activity) =>
      sum +
      (toMetricNumber(activity.budgetCompletion) *
        toMetricNumber(activity.percentagePlanned)) /
        100,
    0,
  );
  const earnedValue = activities.reduce(
    (sum, activity) =>
      sum +
      (toMetricNumber(activity.budgetCompletion) *
        toMetricNumber(activity.percentageCompleted)) /
        100,
    0,
  );
  const actualCost = activities.reduce(
    (sum, activity) => sum + toMetricNumber(activity.actualCost),
    0,
  );

  const costVariance = earnedValue - actualCost;
  const scheduleVariance = earnedValue - plannedValue;
  const costPerformanceIndex = actualCost > 0 ? earnedValue / actualCost : 0;
  const schedulePerformanceIndex = plannedValue > 0 ? earnedValue / plannedValue : 0;
  const estimateAtCompletion =
    costPerformanceIndex > 0 ? budgetAtCompletion / costPerformanceIndex : 0;
  const varianceAtCompletion = budgetAtCompletion - estimateAtCompletion;

  return {
    budgetAtCompletion,
    plannedValue,
    earnedValue,
    actualCost,
    costVariance,
    scheduleVariance,
    costPerformanceIndex,
    schedulePerformanceIndex,
    estimateAtCompletion,
    varianceAtCompletion,
  };
};

export type ActivityFormValues = {
  name: string;
  description: string;
  status: string;
  budgetCompletion: number | "";
  percentagePlanned: number | "";
  percentageCompleted: number | "";
  actualCost: number | "";
  startDate?: Date;
  endDate?: Date;
};

export const createEmptyActivity = (id_project: string): Activity =>
  normalizeActivity({
    id_activity: "new",
    name: "",
    description: "",
    status: "pending",
    budgetCompletion: 0,
    percentagePlanned: 0,
    percentageCompleted: 0,
    actualCost: 0,
    startDate: undefined as unknown as Date,
    endDate: undefined as unknown as Date,
    id_project,
    id_user: "",
    id_user_update: "",
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  });

export const toActivityFormValues = (activity: Activity): ActivityFormValues => {
  const isNew = activity.id_activity === "new";
  const normalized = normalizeActivity(activity);

  return {
    name: normalized.name ?? "",
    description: normalized.description ?? "",
    status: normalized.status || "pending",
    budgetCompletion:
      isNew && normalized.budgetCompletion === 0
        ? ""
        : normalized.budgetCompletion,
    percentagePlanned:
      isNew && normalized.percentagePlanned === 0
        ? ""
        : normalized.percentagePlanned,
    percentageCompleted: normalized.percentageCompleted ?? 0,
    actualCost: normalized.actualCost ?? 0,
    startDate: isNew ? undefined : toDate(normalized.startDate) ?? undefined,
    endDate: isNew ? undefined : toDate(normalized.endDate) ?? undefined,
  };
};

export const toActivityPayload = (
  formValues: ActivityFormValues,
  activity: Activity,
): Activity => {
  if (
    !formValues.startDate ||
    !formValues.endDate ||
    formValues.budgetCompletion === "" ||
    formValues.percentagePlanned === ""
  ) {
    throw new Error("Formulario de actividad incompleto");
  }

  return {
    ...activity,
    name: formValues.name.trim(),
    description: formValues.description.trim(),
    status: formValues.status,
    budgetCompletion: Number(formValues.budgetCompletion),
    percentagePlanned: Number(formValues.percentagePlanned),
    percentageCompleted: Number(formValues.percentageCompleted ?? 0),
    actualCost: Number(formValues.actualCost ?? 0),
    startDate: formValues.startDate,
    endDate: formValues.endDate,
  };
};

export const normalizeActivity = (activity: Activity): Activity => ({
  ...activity,
  startDate: toDate(activity.startDate) ?? new Date(),
  endDate: toDate(activity.endDate) ?? new Date(),
  created_at: toDate(activity.created_at) ?? new Date(),
  updated_at: toDate(activity.updated_at) ?? new Date(),
  budgetCompletion: Number(activity.budgetCompletion) || 0,
  percentagePlanned: Number(activity.percentagePlanned) || 0,
  percentageCompleted: Number(activity.percentageCompleted) || 0,
  actualCost: Number(activity.actualCost) || 0,
});
