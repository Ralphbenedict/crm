const User = require('./User');
const Role = require('./Role');
const { sequelize } = require('../config/database');

// User-Role (Many-to-Many)
User.belongsToMany(Role, { through: 'UserRoles' });
Role.belongsToMany(User, { through: 'UserRoles' });

module.exports = {
    User,
    Role,
    sequelize
};
