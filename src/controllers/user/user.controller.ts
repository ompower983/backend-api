import { Request, Response } from "express";
import { Op } from "sequelize";
import { Department, Designation, Role, User } from "../../models";
import {
  catchResponse,
  errorResponse,
  hashPassword,
  paginate,
  successResponse,
} from "../../utils";

import { ADMIN } from "../../constants";

// ============================================================
// CREATE USER
// ============================================================
// Admin/HR can create Manager, HR or Employee
// ============================================================

export const createUser = async (req: Request, res: Response): Promise<any> => {
  const {
    employeeCode,
    fullName,
    email,
    phone,
    password,
    designationId,
    departmentId,
    roleId,
    reportsToUserId,
    grade,
  } = req.body;

  try {
    // ----------------------------------------------------
    // Validate role
    // ----------------------------------------------------

    const role = await Role.findByPk(roleId);

    if (!role) {
      return errorResponse(res, 400, "Invalid role");
    }

    const existingEmployee = await User.findOne({
      where: {
        employeeCode,
      },
    });

    if (existingEmployee) {
      return errorResponse(res, 400, "Employee code already exists");
    }

    const existingUser = await User.findOne({
      where: {
        email,
      },
    });

    if (existingUser) {
      return errorResponse(res, 400, "Email already exists");
    }

    // ----------------------------------------------------
    // Validate Department
    // ----------------------------------------------------

    const department = await Department.findByPk(departmentId);

    if (!department) {
      return errorResponse(res, 400, "Invalid department");
    }

    // ----------------------------------------------------
    // Validate Designation
    // ----------------------------------------------------

    const designation = await Designation.findByPk(designationId);

    if (!designation) {
      return errorResponse(res, 400, "Invalid designation");
    }
    if (reportsToUserId) {
      const manager = await User.findByPk(reportsToUserId);
      if (!manager) {
        return errorResponse(res, 400, "Reporting manager not found");
      }
      if (!manager.isActive) {
        return errorResponse(res, 400, "Reporting manager is inactive");
      }
    }
    const hashedPassword = await hashPassword(password);
    // ----------------------------------------------------
    // Create user
    // ----------------------------------------------------

    const user = await User.create({
      employeeCode,
      fullName,
      email,
      phone,
      password: hashedPassword,
      designationId: designation?.id || null,
      departmentId: department?.id || null,
      roleId: roleId || null,
      reportsToUserId: reportsToUserId || null,
      isActive: true,
      grade: grade || null,
    });

    // ----------------------------------------------------
    // Return user without password
    // ----------------------------------------------------

    const newData = {
      id: user.id,
      employeeCode: user.employeeCode,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      designationId: user.designationId,
      departmentId: user.departmentId,
      roleId: user.roleId,
      reportsToUserId: user.reportsToUserId,
      isActive: user.isActive,
      grade: user.grade,
    };

    return successResponse(res, 201, "User created successfully", newData);
  } catch (error: any) {
    return catchResponse(
      res,
      "Error creating user",
      error?.errors?.[0]?.message || error?.message || "Unknown error",
    );
  }
};

// ============================================================
// GET ALL USERS
// ============================================================

export const getAllUser = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const {
    page,
    pageSize,
    search,
    sortField,
    sortOrder,
    roleId,
    departmentId,
    designationId,
    status,
  } = req.query;

  const pageNum = page ? parseInt(page as string, 10) : 1;
  const size = pageSize ? parseInt(pageSize as string, 10) : 10;

  const searchTerm = search ? String(search).trim() : "";

  const sortFieldStr = sortField
    ? String(sortField)
    : "createdAt";

  const sortOrderStr = sortOrder
    ? String(sortOrder).toUpperCase()
    : "DESC";

  try {
    // ----------------------------------------------------
    // WHERE CLAUSE
    // ----------------------------------------------------

    const whereClause: any = {};

    // Do not show Admin users in normal user listing
    whereClause.roleId = {
      [Op.ne]: ADMIN,
    };

    // ----------------------------------------------------
    // ROLE FILTER
    // ----------------------------------------------------

    if (roleId) {
      whereClause.roleId = Number(roleId);
    }

    // ----------------------------------------------------
    // DEPARTMENT FILTER
    // ----------------------------------------------------

    if (departmentId) {
      whereClause.departmentId = Number(departmentId);
    }

    // ----------------------------------------------------
    // DESIGNATION FILTER
    // ----------------------------------------------------

    if (designationId) {
      whereClause.designationId = Number(designationId);
    }

    // ----------------------------------------------------
    // STATUS FILTER
    // ----------------------------------------------------

    if (status !== undefined) {
      whereClause.isActive = status === "true";
    }

    // ----------------------------------------------------
    // SEARCH
    // ----------------------------------------------------

    if (searchTerm) {
      whereClause[Op.or] = [
        {
          employeeCode: {
            [Op.like]: `%${searchTerm}%`,
          },
        },
        {
          fullName: {
            [Op.like]: `%${searchTerm}%`,
          },
        },
        {
          email: {
            [Op.like]: `%${searchTerm}%`,
          },
        },
      ];
    }

    // ----------------------------------------------------
    // PAGINATION
    // ----------------------------------------------------

    const result = await paginate({
      model: User,
      page: pageNum,
      pageSize: size,
      whereClause,
      searchQuery: "",
      searchFields: [],
      sortField: sortFieldStr,
      sortOrder: sortOrderStr as "ASC" | "DESC",
      options: {
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
          },
        ],
      },
    });

    return successResponse(
      res,
      200,
      "Users fetched successfully",
      result,
    );
  } catch (error: any) {
    return catchResponse(
      res,
      "Error fetching users",
      error?.errors?.[0]?.message ||
      error?.message ||
      "Unknown error",
    );
  }
};

// ============================================================
// GET USER BY ID
// ============================================================

export const getUser = async (req: Request, res: Response): Promise<any> => {
  const userId = Number(req.params.id);

  try {
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ["password"],
      },

      include: [
        // --------------------------------------------------
        // Role
        // --------------------------------------------------
        {
          model: Role,
          as: "role",
          attributes: ["id", "name"],
        },

        // --------------------------------------------------
        // Department
        // --------------------------------------------------
        {
          model: Department,
          as: "department",
          attributes: ["id", "name"],
        },

        // --------------------------------------------------
        // Designation
        // --------------------------------------------------
        {
          model: Designation,
          as: "designation",
          attributes: ["id", "name"],
        },

        // --------------------------------------------------
        // Reporting Manager
        // --------------------------------------------------
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
        // --------------------------------------------------
        // Employees reporting to this user
        // --------------------------------------------------
        {
          model: User,
          as: "employees",
          attributes: [
            "id",
            "employeeCode",
            "fullName",
            "designationId",
            "departmentId",
            "isActive",
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

    return successResponse(res, 200, "User fetched successfully", user);
  } catch (error: any) {
    return catchResponse(
      res,
      "Error fetching user details",
      error?.errors?.[0]?.message || error?.message || "Unknown error",
    );
  }
};

// ============================================================
// UPDATE USER
// ============================================================

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  const userId = Number(req.params.id);

  const {
    employeeCode,
    fullName,
    email,
    phone,
    designationId,
    departmentId,
    roleId,
    reportsToUserId,
    isActive,
    grade,
  } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    // ----------------------------------------------------
    // Check employee code
    // ----------------------------------------------------

    if (employeeCode) {
      const existingEmployee = await User.findOne({
        where: {
          employeeCode,
          id: {
            [Op.ne]: userId,
          },
        },
      });

      if (existingEmployee) {
        return errorResponse(res, 400, "Employee code already exists");
      }
    }

    // ----------------------------------------------------
    // Check email
    // ----------------------------------------------------

    if (email) {
      const existingUser = await User.findOne({
        where: {
          email,
          id: {
            [Op.ne]: userId,
          },
        },
      });

      if (existingUser) {
        return errorResponse(res, 400, "Email already in use");
      }
    }

    // ----------------------------------------------------
    // Validate role
    // ----------------------------------------------------

    if (roleId != null) {
      const role = await Role.findByPk(roleId);

      if (!role) {
        return errorResponse(res, 400, "Invalid role");
      }
    }

    // ----------------------------------------------------
    // Validate reporting manager
    // ----------------------------------------------------

    if (reportsToUserId != null) {
      // User cannot report to himself
      if (Number(reportsToUserId) === userId) {
        return errorResponse(res, 400, "User cannot report to themselves");
      }

      const manager = await User.findByPk(reportsToUserId);

      if (!manager) {
        return errorResponse(res, 400, "Reporting manager not found");
      }
    }
    // ----------------------------------------------------
    // Validate Department
    // ----------------------------------------------------

    if (departmentId != null) {
      const department = await Department.findByPk(departmentId);

      if (!department) {
        return errorResponse(res, 400, "Invalid department");
      }
    }

    // ----------------------------------------------------
    // Validate Designation
    // ----------------------------------------------------

    if (designationId != null) {
      const designation = await Designation.findByPk(designationId);

      if (!designation) {
        return errorResponse(res, 400, "Invalid designation");
      }
    }

    // ----------------------------------------------------
    // Update
    // ----------------------------------------------------

    await user.update({
      employeeCode,
      fullName,
      email,
      phone,
      designationId,
      departmentId,
      roleId,
      reportsToUserId,
      isActive,
      grade: grade || null,
    });

    // ----------------------------------------------------
    // Return updated user
    // ----------------------------------------------------

    const updatedUser = await User.findByPk(userId, {
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
          attributes: ["id", "employeeCode", "fullName"],
        },
      ],
    });

    return successResponse(res, 200, "User updated successfully", updatedUser);
  } catch (error: any) {
    return catchResponse(
      res,
      "Error updating user",
      error?.errors?.[0]?.message || error?.message || "Unknown error",
    );
  }
};

// ============================================================
// DELETE USER
// ============================================================

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  const userId = Number(req.params.id);

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    // ----------------------------------------------------
    // Prevent deleting yourself
    // ----------------------------------------------------
    const loggedInUserId = (req as any).user?.id;

    if (loggedInUserId && Number(loggedInUserId) === userId) {
      return errorResponse(res, 400, "You cannot delete your own account");
    }
    // ----------------------------------------------------
    // Check if user has employees
    // ----------------------------------------------------

    const employeeCount = await User.count({
      where: {
        reportsToUserId: userId,
      },
    });
    if (employeeCount > 0) {
      return errorResponse(
        res,
        400,
        "User cannot be deleted because other users report to this user",
      );
    }
    // ----------------------------------------------------
    // Delete user
    // ----------------------------------------------------
    await User.destroy({
      where: {
        id: userId,
      },
    });
    return successResponse(res, 200, "User deleted successfully", null);
  } catch (error: any) {
    return catchResponse(
      res,
      "Error deleting user",
      error?.errors?.[0]?.message || error?.message || "Unknown error",
    );
  }
};
