import { Request, Response } from "express";
import { Department, Designation, Role, User } from "../../models";

import {
  catchResponse,
  comparePassword,
  errorResponse,
  generateToken,
  successResponse,
} from "../../utils";

// ============================================================
// LOGIN USER
// ============================================================

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return errorResponse(res, 400, "Email and password are required");
    }

    const user = await User.findOne({
      where: {
        email,
      },

      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!user) {
      return errorResponse(res, 401, "Invalid email or password");
    }

    if (!user.isActive) {
      return errorResponse(
        res,
        403,
        "Your account is inactive. Please contact HR or administrator.",
      );
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return errorResponse(res, 401, "Invalid email or password");
    }

    const jwtToken = generateToken(user);

    const role = (user as any).role;

    const userData = {
      id: user.id,
      employeeCode: user.employeeCode,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      designation: user.designationId,
      department: user.departmentId,
      roleId: user.roleId,
      roleName: role?.name ?? null,
      reportsToUserId: user.reportsToUserId,
      isActive: user.isActive,
    };

    return successResponse(res, 200, "Login successful", {
      token: jwtToken,
      user: userData,
    });
  } catch (error: any) {
    return catchResponse(
      res,
      "Error logging in user",
      error?.errors?.[0]?.message || error?.message || "Unknown error",
    );
  }
};

// ============================================================
// GET USER PROFILE
// ============================================================

export const getUserProfile = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const userId = (req as any).user.id;

  try {
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ["password"],
      },

      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "name"],
        },
        {
          model: Department,
          as: "department",
          attributes: ["id", "name"],
        },
        {
          model: Designation,
          as: "designation",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "manager",
          attributes: [
            "id",
            "employeeCode",
            "fullName",
            "designationId",
            "departmentId",
          ],
          include: [
            {
              model: Department,
              as: "department",
              attributes: ["id", "name"],
            },
            {
              model: Designation,
              as: "designation",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    return successResponse(res, 200, "User profile fetched successfully", user);
  } catch (error: any) {
    return catchResponse(
      res,
      "Error fetching user profile",
      error?.errors?.[0]?.message || error?.message || "Unknown error",
    );
  }
};
