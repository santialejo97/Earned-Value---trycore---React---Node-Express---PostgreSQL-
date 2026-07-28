import { toDate } from "@/lib/utils";
import type { Activity } from "@/type/activities.type";

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
