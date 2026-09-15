import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { catchResponse, errorResponse } from "../../utils";
// ============================================================
// CREATE USER SCHEMA
// ============================================================

export const createUserSchema = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schema = Joi.object({
      employeeCode: Joi.string().trim().min(1).max(50).required().messages({
        "string.empty": "Employee code is required.",
        "any.required": "Employee code is required.",
      }),

      fullName: Joi.string().trim().min(3).max(100).required().messages({
        "string.empty": "Full name is required.",
        "string.min": "Full name must be at least 3 characters long.",
        "string.max": "Full name must be at most 100 characters long.",
        "any.required": "Full name is required.",
      }),

      email: Joi.string().trim().email().max(150).required().messages({
        "string.empty": "Email is required.",
        "string.email": "Please enter a valid Email id.",
        "string.max": "Email must be at most 150 characters long.",
        "any.required": "Email is required.",
      }),

      phone: Joi.string()
        .trim()
        .pattern(/^[0-9]{7,15}$/)
        .required()
        .messages({
          "string.empty": "Phone number is required.",
          "string.pattern.base":
            "Phone number must be between 7 and 15 digits and contain only numbers.",
          "any.required": "Phone number is required.",
        }),

      password: Joi.string()
        .min(6)
        .max(12)
        .pattern(
          /^(?=^[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?][0-9]).{6,12}$/,
        )
        .required()
        .messages({
          "string.empty": "Password is required.",
          "string.pattern.base":
            "Password must be 6-12 characters, start with an uppercase letter, and contain a special character followed by a number.",
          "string.min": "Password must be at least 6 characters long.",
          "string.max": "Password must be at most 12 characters long.",
          "any.required": "Password is required.",
        }),

      designation: Joi.string().trim().max(100).required().messages({
        "string.empty": "Designation is required.",
        "string.max": "Designation must be at most 100 characters long.",
        "any.required": "Designation is required.",
      }),

      department: Joi.string().trim().max(100).required().messages({
        "string.empty": "Department is required.",
        "string.max": "Department must be at most 100 characters long.",
        "any.required": "Department is required.",
      }),

      roleId: Joi.number().integer().positive().required().messages({
        "number.base": "Role ID must be a number.",
        "number.integer": "Role ID must be an integer.",
        "number.positive": "Role ID must be greater than 0.",
        "any.required": "Role ID is required.",
      }),

      reportsToUserId: Joi.number().integer().positive().allow(null).optional().messages({
        "number.base": "Reporting manager ID must be a number.",
        "number.integer": "Reporting manager ID must be an integer.",
        "number.positive": "Reporting manager ID must be greater than 0.",
      }),

      isActive: Joi.boolean().optional().default(true),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return errorResponse(res, 400, error.details[0]?.message);
    }

    next();
  } catch (error) {
    return catchResponse(
      res,
      "Error validating user creation",
      error,
    );
  }
};

// ============================================================
// GET ALL USERS SCHEMA
// ============================================================

export const getAllUserSchema = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schema = Joi.object({
      page: Joi.number().integer().min(1).optional(),

      pageSize: Joi.number().integer().min(1).max(100).optional(),

      search: Joi.string().trim().max(100).optional(),

      sortField: Joi.string()
        .valid(
          "employeeCode",
          "fullName",
          "email",
          "designation",
          "department",
          "createdAt",
          "updatedAt",
        )
        .optional(),

      sortOrder: Joi.string()
        .valid("asc", "desc", "ASC", "DESC")
        .optional(),

      roleId: Joi.number().integer().positive().optional(),

      department: Joi.string().trim().max(100).optional(),

      status: Joi.boolean().optional(),
    });

    const { error } = schema.validate(req.query);

    if (error) {
      return errorResponse(res, 400, error.details[0]?.message);
    }

    next();
  } catch (error) {
    return catchResponse(
      res,
      "Error validating get all users",
      error,
    );
  }
};

// ============================================================
// GET USER BY ID SCHEMA
// ============================================================

export const getUserSchema = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schema = Joi.object({
      id: Joi.number().integer().positive().required().messages({
        "number.base": "User ID must be a number.",
        "number.integer": "User ID must be an integer.",
        "number.positive": "User ID must be greater than 0.",
        "any.required": "User ID is required.",
      }),
    });

    const { error } = schema.validate(req.params);

    if (error) {
      return errorResponse(res, 400, error.details[0]?.message);
    }

    next();
  } catch (error) {
    return catchResponse(
      res,
      "Error validating user ID",
      error,
    );
  }
};

// ============================================================
// UPDATE USER SCHEMA
// ============================================================

export const updateUserSchema = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schema = Joi.object({
      employeeCode: Joi.string().trim().min(1).max(50).optional(),

      fullName: Joi.string().trim().min(3).max(100).optional().messages({
        "string.min": "Full name must be at least 3 characters long.",
        "string.max": "Full name must be at most 100 characters long.",
      }),

      email: Joi.string().trim().email().max(150).optional().messages({
        "string.email": "Please enter a valid Email id.",
        "string.max": "Email must be at most 150 characters long.",
      }),

      phone: Joi.string()
        .trim()
        .pattern(/^[0-9]{7,15}$/)
        .optional()
        .messages({
          "string.pattern.base":
            "Phone number must be between 7 and 15 digits and contain only numbers.",
        }),

      designation: Joi.string().trim().max(100).optional(),

      department: Joi.string().trim().max(100).optional(),

      roleId: Joi.number().integer().positive().optional().messages({
        "number.base": "Role ID must be a number.",
        "number.integer": "Role ID must be an integer.",
        "number.positive": "Role ID must be greater than 0.",
      }),

      reportsToUserId: Joi.number()
        .integer()
        .positive()
        .allow(null)
        .optional()
        .messages({
          "number.base": "Reporting manager ID must be a number.",
          "number.integer": "Reporting manager ID must be an integer.",
          "number.positive":
            "Reporting manager ID must be greater than 0.",
        }),

      isActive: Joi.boolean().optional(),
    }).min(1);

    const { error } = schema.validate(req.body);

    if (error) {
      return errorResponse(res, 400, error.details[0]?.message);
    }

    next();
  } catch (error) {
    return catchResponse(
      res,
      "Error validating update user",
      error,
    );
  }
};

// ============================================================
// DELETE USER SCHEMA
// ============================================================

export const deleteUserSchema = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schema = Joi.object({
      id: Joi.number().integer().positive().required().messages({
        "number.base": "User ID must be a number.",
        "number.integer": "User ID must be an integer.",
        "number.positive": "User ID must be greater than 0.",
        "any.required": "User ID is required.",
      }),
    });

    const { error } = schema.validate(req.params);

    if (error) {
      return errorResponse(res, 400, error.details[0]?.message);
    }

    next();
  } catch (error) {
    return catchResponse(
      res,
      "Error validating delete user",
      error,
    );
  }
};
