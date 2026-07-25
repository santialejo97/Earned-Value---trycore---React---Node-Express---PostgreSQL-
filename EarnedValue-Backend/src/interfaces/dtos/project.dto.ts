import { Model, Optional } from "sequelize";
import { Status } from "../constants.interfaces";

export interface ProjectAttributes {
  id: string;
  name: string;
  description: string;
  status: Status;
  id_user: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

export type ProjectCreationAttributes = Optional<
  ProjectAttributes,
  "id" | "status" | "created_at" | "updated_at" | "deleted_at"
>;

export interface ProjectInstance
  extends
    Model<ProjectAttributes, ProjectCreationAttributes>,
    ProjectAttributes {}
