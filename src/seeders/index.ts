import { seedAdmin } from "./admin.seed";
import { seedDepartments } from "./departments.seed";
import { seedDesignations } from "./designations.seed";
import { seedRoles } from "./role.seed";

export const seedDatabase = async () => {
    try {
        await seedRoles();
        console.log('Role seeder successfully completed');

        await seedAdmin();
        console.log('Admin seeder successfully completed');

        await seedDepartments();
        console.log('Department seeder successfully completed');
        
        await seedDesignations();
        console.log('Designation seeder successfully completed');
        console.log('Database seeding completed');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

seedDatabase();                     