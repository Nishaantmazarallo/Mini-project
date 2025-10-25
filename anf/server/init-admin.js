const Database = require('./models/database');
const User = require('./models/User');
const config = require('./config');

async function createAdminUser() {
  try {
    console.log('Creating admin user...');

    const db = new Database();
    await db.connect();
    await db.initializeTables();

    const userModel = new User(db);

    // Check if admin already exists
    const existingAdmin = await userModel.findByEmail(config.admin.email);
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const result = await userModel.create({
      email: config.admin.email,
      password: config.admin.password,
      name: 'Admin',
      role: 'admin'
    });

    console.log('Admin user created successfully');
    console.log(`Email: ${config.admin.email}`);
    console.log(`Password: ${config.admin.password}`);

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdminUser();
