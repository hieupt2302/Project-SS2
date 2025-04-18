const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'SS2',           // Tên cơ sở dữ liệu
  'root',          // Tên người dùng MySQL
  'your_password', // Mật khẩu người dùng MySQL
  {
    host: 'localhost', // Địa chỉ máy chủ MySQL (thay localhost nếu bạn có host khác)
    dialect: 'mysql',  // Chọn MySQL làm dialect
    logging: false     
  }
);

module.exports = sequelize;