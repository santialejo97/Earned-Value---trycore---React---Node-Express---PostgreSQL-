import { earnedApi } from "@/api/EarnedApi";
import type {
  createOrUpdateProjectResponse,
  Project,
} from "@/type/projects.type";

export const createOrUpdateProjectAction = async (
  projectLike: Project,
): Promise<Project> => {
  const { id, name, description, status } = projectLike;

  const isCreateing = id === "new";

  const { data } = await earnedApi<createOrUpdateProjectResponse>({
    url: isCreateing ? "project/create" : `project/edit/${id}`,
    method: isCreateing ? "POST" : "PATCH",
    data: {
      name,
      description,
      status,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  return {
    ...data.project,
  };
};
