import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config";

interface OutdoorDutyAttributes {
  id: number;
  employeeId: number;
  dateOfVisit: Date;
  timeDuration: string;
  placeVisited: string;
  remarks: string;
  beforeVisit: boolean;
  afterVisit: boolean;
  status: string;
}

interface OutdoorDutyCreationAttributes extends Optional<
  OutdoorDutyAttributes,
  "id" | "status"
> {}

class OutdoorDuty extends Model<
  OutdoorDutyAttributes,
  OutdoorDutyCreationAttributes
> {
  declare id: number;
  declare employeeId: number;
  declare dateOfVisit: Date;
  declare timeDuration: string;
  declare placeVisited: string;
  declare remarks: string;
  declare beforeVisit: boolean;
  declare afterVisit: boolean;
  declare status: string;
}

OutdoorDuty.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    dateOfVisit: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    timeDuration: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    placeVisited: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    beforeVisit: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    afterVisit: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "PENDING",
    },
  },
  {
    sequelize,
    modelName: "OutdoorDuty",
    tableName: "outdoor_duties",
    timestamps: true,
    underscored: true,
  },
);

export default OutdoorDuty;
