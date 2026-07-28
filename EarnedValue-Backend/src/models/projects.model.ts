import { DataTypes, Model, Optional } from "sequelize";
import { connection } from "../db/db";
import User from "./users.model";
import { Status } from "../interfaces/constants.interfaces";
import { ProjectInstance } from "../interfaces/dtos/project.dto";

export const Project = connection.define<ProjectInstance>(
  "tbl_projects",
  {
    id: {
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
    tableName: "tbl_projects",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  },
);

User.hasMany(Project, { foreignKey: "id_user", as: "projects" });
Project.belongsTo(User, { foreignKey: "id_user", as: "user" });

export default Project;
