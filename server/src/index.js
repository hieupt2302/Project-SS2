const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();
// import các file cấu hình khác
const sequelize = require('./config/database');
require('./config/passport')(passport);

// Import các model và associations
require('./models/associations');  // Kết nối các model và associations
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const historyRoutes = require('./routes/historyRoutes');
const { fetchAndSaveUsers, fetchAndSaveRecipes } = require('./config/fetchRecipe');

const app = express();

// Cấu hình CORS để chỉ chấp nhận yêu cầu từ localhost:5173
app.use(cors({
  origin: 'http://localhost:5173',  // Chỉ cho phép yêu cầu từ http://localhost:5173
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,  // Cho phép cookie được gửi trong yêu cầu từ client
}));

// Cấu hình body parser cho các yêu cầu JSON
app.use(express.json());

// Cấu hình session cho việc quản lý đăng nhập
app.use(session({
  secret: 'Hieu@23204',  // Lấy giá trị từ .env
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false, // true nếu dùng HTTPS
    maxAge: 24 * 60 * 60 * 1000,
  }
}));

// Cấu hình passport cho xác thực
app.use(passport.initialize());
app.use(passport.session());

// Đăng ký các routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes)
app.use('/recipes', recipeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/reviews', reviewRoutes);
app.use('/history', historyRoutes);
// Kết nối với cơ sở dữ liệu và khởi động server
sequelize.sync().then(async () => {
  // await fetchAndSaveUsers();  // Gọi hàm fetchAndSaveUsers sau khi đồng bộ hóa database
  // await fetchAndSaveRecipes();  // Gọi hàm fetchAndSaveRecipes sau khi đồng bộ hóa database
  app.listen(5000, () => console.log('Server started at http://localhost:5000'));
});
