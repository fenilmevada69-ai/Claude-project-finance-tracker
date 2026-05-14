const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAIInsights } = require('../controllers/aiController');

router.use(protect);
router.get('/insights', getAIInsights);

module.exports = router;