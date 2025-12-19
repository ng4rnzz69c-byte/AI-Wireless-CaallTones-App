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

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.get('/', getAllCallTones);
router.get('/ai-generated', getAIGeneratedCallTones);
router.get('/:id', getCallTone);
router.post('/upload', upload.single('file'), uploadCallTone);
router.delete('/:id', deleteCallTone);
router.put('/:id/select', selectCallTone);

module.exports = router;
