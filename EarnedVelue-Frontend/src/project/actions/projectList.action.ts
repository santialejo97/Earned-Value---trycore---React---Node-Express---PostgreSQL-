import { earnedApi } from "@/api/EarnedApi";
import type { ProjectsListResponse } from "@/type/projects.type";

export const projectListAction = async (): Promise<ProjectsListResponse> => {
  try {
    const { data } = await earnedApi.get<ProjectsListResponse>("project/list");
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
