import { DataTypes, Model, Optional } from "sequelize";

import { sequelize } from "../../config";

interface UserAttributes {
  id: number;
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  designationId: number | null;
  departmentId: number | null;
  roleId?: number | null;
  reportsToUserId?: number | null;
  isActive: boolean;
  grade?: string | null;
}

interface UserCreationAttributes extends Optional<
  UserAttributes,
  "id" | "roleId" | "reportsToUserId" | "isActive" | "grade"
> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: number;
  declare employeeCode: string;
  declare fullName: string;
  declare email: string;
  declare phone: string;
  declare password: string;
  declare designationId: number | null;
  declare departmentId: number | null;
  declare roleId: number | null;
  declare reportsToUserId: number | null;
  declare isActive: boolean;
  declare grade: string | null;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    fullName: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: "departments",
        key: "id",
      },
    },
    designationId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: "designations",
        key: "id",
      },
    },
    roleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: "roles",
        key: "id",
      },
    },
    reportsToUserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    grade: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    underscored: true,
    paranoid: true,
  },
);

export default User;
