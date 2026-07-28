import { earnedApi } from "@/api/EarnedApi";
import { toTimestamp } from "@/lib/utils";
import type {
  Activity,
  createOrUpdateActivityResponse,
} from "@/type/activities.type";
import { normalizeActivity } from "../utils/activity.utils";

export const createOrUpdateActivityAction = async (
  activityLike: Activity,
  id_project: string,
): Promise<Activity> => {
  const {
    id_activity,
    name,
    description,
    status,
    budgetCompletion,
    percentagePlanned,
    percentageCompleted,
    actualCost,
    startDate,
    endDate,
  } = activityLike;

  const isCreateing = id_activity === "new";
  const startDateTimestamp = toTimestamp(startDate);
  const endDateTimestamp = toTimestamp(endDate);

  if (startDateTimestamp == null || endDateTimestamp == null) {
    throw new Error("Las fechas de inicio y fin son inválidas");
  }

  const { data } = await earnedApi<createOrUpdateActivityResponse>({
    url: isCreateing
      ? `activities/create/${id_project}`
      : `activities/edit/${id_activity}`,
    method: isCreateing ? "POST" : "PATCH",
    data: {
      name,
      description,
      status,
      budgetCompletion: Number(budgetCompletion),
      percentagePlanned: Number(percentagePlanned),
      percentageCompleted: Number(percentageCompleted),
      actualCost: Number(actualCost),
      startDate: startDateTimestamp,
      endDate: endDateTimestamp,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  return normalizeActivity(data.activity);
};
