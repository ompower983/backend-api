import { Request, Response } from "express";
import { Op } from "sequelize";
import { User, Role } from "../../models";
import { catchResponse, successResponse } from "../../utils";

export const getDashboard = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        // Find Admin role
        const adminRole = await Role.findOne({
            where: {
                name: "Admin",
            },
        });

        const userWhere: any = {};

        if (adminRole) {
            userWhere.roleId = {
                [Op.ne]: adminRole.id,
            };
        }

        const totalUsers = await User.count({
            where: userWhere,
        });

        const activeUsers = await User.count({
            where: {
                ...userWhere,
                isActive: true,
            },
        });

        const inactiveUsers = await User.count({
            where: {
                ...userWhere,
                isActive: false,
            },
        });

        const dashboardData = {
            totalUsers,
            activeUsers,
            inactiveUsers,
        };

        return successResponse(
            res,
            200,
            "Dashboard data fetched successfully",
            dashboardData
        );
    } catch (error: any) {
        return catchResponse(
            res,
            "Error fetching dashboard data",
            error?.errors?.[0]?.message ||
            error?.message ||
            "Unknown error"
        );
    }
};