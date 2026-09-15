import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

interface DesignationAttributes {
    id: number;
    name: string;
}

interface DesignationCreationAttributes
    extends Optional<DesignationAttributes, "id"> {}

class Designation extends Model<
    DesignationAttributes,
    DesignationCreationAttributes
> {
    declare id: number;
    declare name: string;
}

Designation.init(
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
        modelName: "Designation",
        tableName: "designations",
        timestamps: true,
        underscored: true,
        paranoid: true,
    }
);

export default Designation;