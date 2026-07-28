import { earnedApi } from "@/api/EarnedApi";
import type { Project, ProjectByIdResponse } from "@/type/projects.type";

export const getProjectByIdAction = async (id: string): Promise<Project> => {
  if (!id) throw new Error("ID is required");

  if (id === "new")
    return {
      id,
      name: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as Project;

  try {
    const { data } = await earnedApi.get<ProjectByIdResponse>(`project/${id}`);
    return data.project;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
