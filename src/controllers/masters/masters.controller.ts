import { Request, Response } from "express";
import { Department, Designation } from "../../models";
import { catchResponse, successResponse } from "../../utils";

export const getAllDepartments = async (
    req: Request,
    res: Response,
): Promise<any> => {
    try {
        const departments = await Department.findAll({
            attributes: ["id", "name"],
            order: [["name", "ASC"]],
        });

        return successResponse(
            res,
            200,
            "Departments fetched successfully",
            departments,
        );
    } catch (error: any) {
        return catchResponse(
            res,
            "Error fetching departments",
            error?.errors?.[0]?.message ||
            error?.message ||
            "Unknown error",
        );
    }
};

export const getAllDesignations = async (
    req: Request,
    res: Response,
): Promise<any> => {
    try {
        const designations = await Designation.findAll({
            attributes: ["id", "name"],
            order: [["name", "ASC"]],
        });

        return successResponse(
            res,
            200,
            "Designations fetched successfully",
            designations,
        );
    } catch (error: any) {
        return catchResponse(
            res,
            "Error fetching designations",
            error?.errors?.[0]?.message ||
            error?.message ||
            "Unknown error",
        );
    }
};