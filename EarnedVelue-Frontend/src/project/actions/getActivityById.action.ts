import { earnedApi } from "@/api/EarnedApi";
import type { Activity, getActivityByIdResponse } from "@/type/activities.type";
import { createEmptyActivity, normalizeActivity } from "../utils/activity.utils";

export const getActivityByIdAction = async (
  id_activity: string,
): Promise<Activity> => {
  if (!id_activity) throw new Error("ID is required");

  if (id_activity === "new") return createEmptyActivity("");

  try {
    const { data } = await earnedApi.get<getActivityByIdResponse>(
      `activities/${id_activity}`,
    );
    return normalizeActivity(data.activity);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
