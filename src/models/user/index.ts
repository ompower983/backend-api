import { Department } from "../department";
import { Designation } from "../designation";
import { Role } from "../role";
import User from "./user.model";

// associations
Role.hasMany(User, { foreignKey: "roleId", as: "users" });
User.belongsTo(Role, { foreignKey: "roleId", as: "role" });
// Department associations
Department.hasMany(User, {foreignKey: "departmentId",as: "users",});
User.belongsTo(Department, {foreignKey: "departmentId",as: "department",});
// Designation associations
Designation.hasMany(User, {foreignKey: "designationId",as: "users",});
User.belongsTo(Designation, {foreignKey: "designationId",as: "designation",});
User.belongsTo(User, { foreignKey: "reportsToUserId", as: "manager" });
User.hasMany(User, { foreignKey: "reportsToUserId", as: "employees" });

export { User };
