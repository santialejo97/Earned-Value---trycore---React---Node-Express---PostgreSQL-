import { earnedApi } from "@/api/EarnedApi";

export const deleteProjectAction = async (id: string) => {
  if (!id) throw new Error("ID is required");

  try {
    const { data } = await earnedApi.delete(`project/delete/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
