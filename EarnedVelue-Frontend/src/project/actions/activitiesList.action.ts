import { earnedApi } from "@/api/EarnedApi";
import type { ActivitiesListResponse } from "@/type/activities.type";
import { normalizeActivity } from "../utils/activity.utils";

export const activitiesListAction = async (
  id_project: string,
): Promise<ActivitiesListResponse> => {
  if (!id_project) throw new Error("The id_project is required");

  try {
    const { data } = await earnedApi.get<ActivitiesListResponse>(
      `activities/list/${id_project}`,
    );

    return {
      ...data,
      activities: data.activities.map(normalizeActivity),
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
