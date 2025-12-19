const express = require('express');
const {
  getAllCallTones,
  getCallTone,
  uploadCallTone,
  deleteCallTone,
  selectCallTone,
  getAIGeneratedCallTones,
} = require('../controllers/callToneController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/storage');
const { apiLimiter, uploadLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.get('/', apiLimiter, getAllCallTones);
router.get('/ai-generated', apiLimiter, getAIGeneratedCallTones);
router.get('/:id', apiLimiter, getCallTone);
router.post('/upload', uploadLimiter, upload.single('file'), uploadCallTone);
router.delete('/:id', apiLimiter, deleteCallTone);
router.put('/:id/select', apiLimiter, selectCallTone);

module.exports = router;
