import { earnedApi } from "@/api/EarnedApi";
import type { deleteActivityResponse } from "@/type/activities.type";

export const deleteActivityAction = async (
  id: string,
): Promise<deleteActivityResponse> => {
  if (!id) throw new Error("ID is required");
  try {
    const { data } = await earnedApi.delete<deleteActivityResponse>(
      `activities/delete/${id}`,
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
