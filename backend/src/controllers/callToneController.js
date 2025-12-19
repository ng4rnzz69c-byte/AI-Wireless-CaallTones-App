const CallTone = require('../models/CallTone');
const User = require('../models/User');
const path = require('path');
const fs = require('fs').promises;

// @desc    Get all call tones
// @route   GET /api/calltones
// @access  Private
const getAllCallTones = async (req, res, next) => {
  try {
    const { category, isPublic } = req.query;
    
    let query = {};
    
    // Filter by category if provided
    if (category) {
      query.category = category;
    }
    
    // Get public tones or user's own tones
    if (isPublic === 'true') {
      query.isPublic = true;
    } else {
      query.$or = [
        { isPublic: true },
        { uploadedBy: req.user.id }
      ];
    }

    const callTones = await CallTone.find(query)
      .populate('uploadedBy', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: callTones.length,
      data: callTones,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single call tone
// @route   GET /api/calltones/:id
// @access  Private
const getCallTone = async (req, res, next) => {
  try {
    const callTone = await CallTone.findById(req.params.id)
      .populate('uploadedBy', 'username');

    if (!callTone) {
      return res.status(404).json({
        success: false,
        message: 'Call tone not found',
      });
    }

    res.status(200).json({
      success: true,
      data: callTone,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload call tone
// @route   POST /api/calltones/upload
// @access  Private
const uploadCallTone = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    const { title, description, isPublic, tags } = req.body;

    // Get file URL based on storage type
    const fileUrl = req.file.location || `/uploads/${req.file.filename}`;

    const callTone = await CallTone.create({
      title: title || req.file.originalname,
      description,
      fileUrl,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user.id,
      isPublic: isPublic === 'true',
      category: 'user-uploaded',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    });

    res.status(201).json({
      success: true,
      data: callTone,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete call tone
// @route   DELETE /api/calltones/:id
// @access  Private
const deleteCallTone = async (req, res, next) => {
  try {
    const callTone = await CallTone.findById(req.params.id);

    if (!callTone) {
      return res.status(404).json({
        success: false,
        message: 'Call tone not found',
      });
    }

    // Make sure user owns the call tone
    if (callTone.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this call tone',
      });
    }

    // Delete file from local storage if not using S3
    if (!callTone.fileUrl.startsWith('https://') && !callTone.fileUrl.startsWith('http://')) {
      const filePath = path.join(__dirname, '../../', callTone.fileUrl);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }

    await callTone.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Call tone deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set user's selected call tone
// @route   PUT /api/calltones/:id/select
// @access  Private
const selectCallTone = async (req, res, next) => {
  try {
    const callTone = await CallTone.findById(req.params.id);

    if (!callTone) {
      return res.status(404).json({
        success: false,
        message: 'Call tone not found',
      });
    }

    // Update user's selected call tone
    await User.findByIdAndUpdate(req.user.id, {
      selectedCallTone: callTone._id,
    });

    res.status(200).json({
      success: true,
      message: 'Call tone selected successfully',
      data: callTone,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI-generated call tones
// @route   GET /api/calltones/ai-generated
// @access  Private
const getAIGeneratedCallTones = async (req, res, next) => {
  try {
    const callTones = await CallTone.find({
      isAIGenerated: true,
      isPublic: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: callTones.length,
      data: callTones,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCallTones,
  getCallTone,
  uploadCallTone,
  deleteCallTone,
  selectCallTone,
  getAIGeneratedCallTones,
};
