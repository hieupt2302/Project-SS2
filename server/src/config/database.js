const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'SS2',           // DB name
  'root',          // MySQL username
  process.env.MYSQL_PROJECT_PASSWORD, // Your MySQL password
  {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
  }
);

module.exports = sequelize;