import { Model, Optional } from "sequelize";
import { Status } from "../constants.interfaces";

export interface ActivityAttributes {
  id_activity: string;
  name: string;
  description: string;
  budgetCompletion: number;
  percentagePlanned: number;
  percentageCompleted: number;
  actualCost: number;
  status: Status;
  startDate: Date;
  endDate: Date;
  id_project: string;
  id_user: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

export type ActivityCreationAttributes = Optional<
  ActivityAttributes,
  "id_activity" | "status" | "created_at" | "updated_at" | "deleted_at"
>;

export interface ActivityInstance
  extends
    Model<ActivityAttributes, ActivityCreationAttributes>,
    ActivityAttributes {}
