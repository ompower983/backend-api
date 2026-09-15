import { Role } from "../models";
import {
    ADMIN,
    MANAGER,
    HR,
    EMPLOYEE,
} from "../constants";

const roles = [
    { id: ADMIN, name: "Admin" },
    { id: MANAGER, name: "Manager" },
    { id: HR, name: "HR" },
    { id: EMPLOYEE, name: "Employee" },
];

export const seedRoles = async (): Promise<void> => {
    try {
        // Fetch existing roles
        const existingRoles = await Role.findAll();

        const newRoleIds = roles.map((role) => role.id);

        // Delete roles that are no longer defined
        for (const existingRole of existingRoles) {
            if (!newRoleIds.includes(existingRole.id)) {
                await existingRole.destroy();

                console.log(
                    `Role '${existingRole.name}' deleted.`
                );
            }
        }

        // Create or update roles
        for (const roleData of roles) {
            const [role, created] = await Role.findOrCreate({
                where: {
                    id: roleData.id,
                },
                defaults: roleData,
            });

            if (created) {
                console.log(
                    `Role '${role.name}' created.`
                );
            } else if (role.name !== roleData.name) {
                await role.update({
                    name: roleData.name,
                });

                console.log(
                    `Role '${roleData.name}' updated.`
                );
            } else {
                console.log(
                    `Role '${role.name}' already exists.`
                );
            }
        }

        console.log("Roles synchronization completed.");
    } catch (error) {
        console.error("Error seeding roles:", error);
    }
};