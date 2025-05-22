const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { createRecipe } = require('../controllers/recipeController');

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.post('/', upload.single('image'), createRecipe);

module.exports = router;
