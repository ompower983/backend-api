import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config";

interface ApprovalAttributes {
    id: number;
    outdoorDutyId: number;
    approverId: number;
    status: string;
    tokenHash: string | null;
    tokenExpiresAt: Date | null;
    approvedAt: Date | null;
    rejectedAt: Date | null;
    rejectionReason: string | null;
}

interface ApprovalCreationAttributes
    extends Optional<
        ApprovalAttributes,
        | "id"
        | "status"
        | "tokenHash"
        | "tokenExpiresAt"
        | "approvedAt"
        | "rejectedAt"
        | "rejectionReason"
    > {}

class Approval extends Model<
    ApprovalAttributes,
    ApprovalCreationAttributes
> {
    declare id: number;
    declare outdoorDutyId: number;
    declare approverId: number;
    declare status: string;
    declare tokenHash: string | null;
    declare tokenExpiresAt: Date | null;
    declare approvedAt: Date | null;
    declare rejectedAt: Date | null;
    declare rejectionReason: string | null;
}

Approval.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        outdoorDutyId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: "outdoor_duties",
                key: "id",
            },
        },
        approverId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },
        status: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "PENDING",
        },
        tokenHash: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        tokenExpiresAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        approvedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        rejectedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        rejectionReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Approval",
        tableName: "approvals",
        timestamps: true,
        underscored: true,
    }
);

export default Approval;