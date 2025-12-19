const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const path = require('path');

// Check if AWS credentials are configured
const isS3Configured = process.env.AWS_ACCESS_KEY_ID && 
                       process.env.AWS_SECRET_ACCESS_KEY && 
                       process.env.AWS_S3_BUCKET;

let upload;

if (isS3Configured) {
  // Configure AWS S3
  const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  // Configure Multer with S3
  upload = multer({
    storage: multerS3({
      s3: s3Client,
      bucket: process.env.AWS_S3_BUCKET,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `calltones/${uniqueSuffix}${path.extname(file.originalname)}`);
      },
    }),
    limits: {
      fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'audio/mpeg,audio/mp3,audio/wav,audio/ogg').split(',');
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only audio files are allowed.'));
      }
    },
  });
} else {
  // Fallback to local storage if S3 is not configured
  const localStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `calltone-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  });

  upload = multer({
    storage: localStorage,
    limits: {
      fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'audio/mpeg,audio/mp3,audio/wav,audio/ogg').split(',');
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only audio files are allowed.'));
      }
    },
  });
}

module.exports = { upload, isS3Configured };
