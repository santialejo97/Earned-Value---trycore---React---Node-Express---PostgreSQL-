import { DataTypes, Model, Optional } from "sequelize";
import { connection } from "../db/db";
import Project from "./projects.model";
import { Status } from "../interfaces/constants.interfaces";
import User from "./users.model";
import { ActivityInstance } from "../interfaces/dtos/activity.dto";

export const Activity = connection.define<ActivityInstance>(
  "tbl_activities",
  {
    id_activity: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    budgetCompletion: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    percentagePlanned: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    percentageCompleted: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    actualCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        Status.PENDING,
        Status.IN_PROGRESS,
        Status.COMPLETED,
        Status.DELETE,
      ),
      allowNull: false,
      defaultValue: Status.PENDING,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    id_project: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Project,
        key: "id",
      },
    },
    id_user: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id_user",
      },
    },
  },
  {
    tableName: "tbl_activities",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  },
);

Project.hasMany(Activity, { foreignKey: "id_project", as: "activities" });
Activity.belongsTo(Project, { foreignKey: "id_project", as: "project" });

User.hasMany(Activity, { foreignKey: "id_user", as: "activities" });
Activity.belongsTo(User, { foreignKey: "id_user", as: "user" });

export default Activity;
