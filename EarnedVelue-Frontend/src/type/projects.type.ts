export interface ProjectsListResponse {
  ok: boolean;
  projects: Project[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  id_user: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
}
