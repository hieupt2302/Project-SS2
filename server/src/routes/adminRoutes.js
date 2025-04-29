const express = require('express');
const checkRole = require('../middlewares/checkRole');
const { getUser, deleteUser, updateUser } = require('../controllers/adminController');

const router = express.Router();

// Lấy thông tin user
router.get('/users/:id', checkRole('admin'), getUser);

// Xóa user
router.delete('/users/:id', checkRole('admin'), deleteUser);

// Cập nhật thông tin user
router.put('/users/:id', checkRole('admin'), updateUser);

module.exports = router;