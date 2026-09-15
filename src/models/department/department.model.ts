import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

interface DepartmentAttributes {
    id: number;
    name: string;
}

interface DepartmentCreationAttributes
    extends Optional<DepartmentAttributes, "id"> {}

class Department extends Model<
    DepartmentAttributes,
    DepartmentCreationAttributes
> {
    declare id: number;
    declare name: string;
}

Department.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING(128),
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
        modelName: "Department",
        tableName: "departments",
        timestamps: true,
        underscored: true,
        paranoid: true,
    }
);

export default Department;