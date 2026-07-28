import { Model, Optional } from "sequelize";

export interface UserAttributes {
  id_user: string;
  name: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  "id_user" | "created_at" | "updated_at" | "deleted_at"
>;

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}
