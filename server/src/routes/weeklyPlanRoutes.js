const express = require('express');
const router = express.Router();
const { getPlan, addToPlan, removeFromPlan } = require('../controllers/weeklyPlanController');
const { ensureAuth } = require('../middlewares/authMiddleware');

router.get('/my-plan', ensureAuth, getPlan);
router.post('/add', ensureAuth, addToPlan);
router.delete('/remove', ensureAuth, removeFromPlan);

module.exports = router;
