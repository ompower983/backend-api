import { Department, Designation, User } from "../models";
import { hashPassword } from "../utils";
import { ADMIN } from "../constants";
import dotenv from "dotenv";

dotenv.config();

const {
    ADMIN_EMPLOYEE_CODE,
    ADMIN_FULL_NAME,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    ADMIN_PHONE,
    ADMIN_DESIGNATION,
    ADMIN_DEPARTMENT,
} = process.env;

// Create Admin
export const seedAdmin = async () => {
    const employeeCode = ADMIN_EMPLOYEE_CODE || "ADMIN001";
    const fullName = ADMIN_FULL_NAME || "System Admin";
    const email = ADMIN_EMAIL || "admin@ompower.in";
    const password = ADMIN_PASSWORD || "Admin@123";
    const phone = ADMIN_PHONE || "1234567890";

    const designationName =
        ADMIN_DESIGNATION || "Project Manager";

    const departmentName =
        ADMIN_DEPARTMENT || "Development";

    try {
        // Check if admin already exists
        const admin = await User.findOne({
            where: {
                email,
            },
        });

        if (admin) {
            console.log("Admin already exists");
            return;
        }

        // Find designation
        const designation = await Designation.findOne({
            where: {
                name: designationName,
            },
        });

        if (!designation) {
            throw new Error(
                `Designation "${designationName}" not found. Run designation seeder first.`,
            );
        }

        // Find department
        const department = await Department.findOne({
            where: {
                name: departmentName,
            },
        });

        if (!department) {
            throw new Error(
                `Department "${departmentName}" not found. Run department seeder first.`,
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create admin
        await User.create({
            employeeCode,
            fullName,
            email,
            phone,
            password: hashedPassword,
            designationId: designation.id,
            departmentId: department.id,
            roleId: ADMIN,
            reportsToUserId: null,
            isActive: true,
        });

        console.log("Admin created successfully");
    } catch (error) {
        console.error("Error seeding the admin:", error);
    }
};