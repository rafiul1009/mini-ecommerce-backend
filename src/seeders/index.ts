import { seedAdmin } from './adminSeeder';

export const runSeeders = async (): Promise<void> => {
  try {
    await seedAdmin();
    console.log('All seeders completed successfully');
  } catch (error) {
    console.error('Error running seeders:', error);
    throw error;
  }
};