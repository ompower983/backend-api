import { FINANCE_EXECUTIVE, HR_EXECUTIVE, PROCUREMENT_EXECUTIVE, PROJECT_MANAGER, QUALITY_OFFICER, SAFETY_OFFICER, SITE_MANAGER, SITE_SUPERVISOR, SURVEYOR } from "../constants";
import { Designation } from "../models/designation";


const designations = [
    {
        id: PROJECT_MANAGER,
        name: "Project Manager",
    },
    {
        id: SITE_MANAGER,
        name: "Site Manager",
    },
    {
        id: SITE_SUPERVISOR,
        name: "Site Supervisor",
    },
    {
        id: QUALITY_OFFICER,
        name: "Quality Officer",
    },
    {
        id: SAFETY_OFFICER,
        name: "Safety Officer",
    },
    {
        id: SURVEYOR,
        name: "Surveyor",
    },
    {
        id: HR_EXECUTIVE,
        name: "HR Executive",
    },
    {
        id: FINANCE_EXECUTIVE,
        name: "Finance Executive",
    },
    {
        id: PROCUREMENT_EXECUTIVE,
        name: "Procurement Executive",
    },
];

export const seedDesignations = async (): Promise<void> => {
    try {
        const existingDesignations =
            await Designation.findAll();

        const newDesignationIds = designations.map(
            (designation) => designation.id
        );

        // Delete designations no longer present
        for (const existingDesignation of existingDesignations) {
            if (
                !newDesignationIds.includes(
                    existingDesignation.id
                )
            ) {
                await existingDesignation.destroy();

                console.log(
                    `Designation '${existingDesignation.name}' deleted.`
                );
            }
        }

        // Create or update designations
        for (const designationData of designations) {
            const [designation, created] =
                await Designation.findOrCreate({
                    where: {
                        id: designationData.id,
                    },
                    defaults: designationData,
                });

            if (created) {
                console.log(
                    `Designation '${designation.name}' created.`
                );
            } else if (
                designation.name !== designationData.name
            ) {
                await designation.update({
                    name: designationData.name,
                });

                console.log(
                    `Designation '${designationData.name}' updated.`
                );
            } else {
                console.log(
                    `Designation '${designation.name}' already exists.`
                );
            }
        }

        console.log(
            "Designations synchronization completed."
        );
    } catch (error) {
        console.error(
            "Error seeding designations:",
            error
        );
    }
};