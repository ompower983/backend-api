import { ENGINEERING, FINANCE, HR_DEPARTMENT, MANAGEMENT, PROCUREMENT, PROJECTS, QUALITY, SAFETY, SURVEY } from "../constants";
import { Department } from "../models";
const departments = [
    {
        id: MANAGEMENT,
        name: "Management",
    },
    {
        id: HR_DEPARTMENT,
        name: "HR",
    },
    {
        id: PROJECTS,
        name: "Projects",
    },
    {
        id: QUALITY,
        name: "Quality",
    },
    {
        id: SAFETY,
        name: "Safety",
    },
    {
        id: SURVEY,
        name: "Survey",
    },
    {
        id: FINANCE,
        name: "Finance",
    },
    {
        id: PROCUREMENT,
        name: "Procurement",
    },
    {
        id: ENGINEERING,
        name: "Engineering",
    },
];

export const seedDepartments = async (): Promise<void> => {
    try {
        const existingDepartments =
            await Department.findAll();

        const newDepartmentIds = departments.map(
            (department) => department.id
        );

        // Delete departments no longer present
        for (const existingDepartment of existingDepartments) {
            if (
                !newDepartmentIds.includes(
                    existingDepartment.id
                )
            ) {
                await existingDepartment.destroy();

                console.log(
                    `Department '${existingDepartment.name}' deleted.`
                );
            }
        }

        // Create or update departments
        for (const departmentData of departments) {
            const [department, created] =
                await Department.findOrCreate({
                    where: {
                        id: departmentData.id,
                    },
                    defaults: departmentData,
                });

            if (created) {
                console.log(
                    `Department '${department.name}' created.`
                );
            } else if (
                department.name !== departmentData.name
            ) {
                await department.update({
                    name: departmentData.name,
                });

                console.log(
                    `Department '${departmentData.name}' updated.`
                );
            } else {
                console.log(
                    `Department '${department.name}' already exists.`
                );
            }
        }

        console.log(
            "Departments synchronization completed."
        );
    } catch (error) {
        console.error(
            "Error seeding departments:",
            error
        );
    }
};