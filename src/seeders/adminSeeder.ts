import User from '../models/User';

export const seedAdmin = async (): Promise<void> => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: { email: 'admin@yopmail.com' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    await User.create({
      name: 'Admin',
      email: 'admin@yopmail.com',
      password: '1234',
      type: 'admin'
    });

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error seeding admin user:', error);
    throw error;
  }
};