import { Request, Response } from "express";
import { User } from "../../models";
import { catchResponse, successResponse } from "../../utils";

export const getDashboard = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const totalUsers = await User.count();

        const activeUsers = await User.count({
            where: {
                isActive: true,
            },
        });

        const inactiveUsers = await User.count({
            where: {
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