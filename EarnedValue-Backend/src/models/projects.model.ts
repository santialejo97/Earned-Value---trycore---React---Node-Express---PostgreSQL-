import { DataTypes } from "sequelize";
import { connection } from "../db/db";
import User from "./users.model";

export const Project = connection.define(
  "tbl_projects",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_user: {
      type: DataTypes.INTEGER,
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
