const { sequelize, User, Role } = require('../models');
const bcrypt = require('bcryptjs');

async function initDatabase() {
  try {
    // Sync all models with database
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully');

    // Create default roles
    const roles = await Role.bulkCreate([
      { name: 'admin', description: 'Administrator with full access' },
      { name: 'manager', description: 'Manager with limited administrative access' },
      { name: 'user', description: 'Standard user' }
    ]);
    console.log('Default roles created');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      isActive: true
    });
    
    // Assign admin role
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    await adminUser.addRole(adminRole);
    
    console.log('Admin user created');
    console.log('Database initialization completed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();