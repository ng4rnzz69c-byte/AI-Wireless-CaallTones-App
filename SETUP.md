# AI Wireless CallTones App - Setup Guide

This guide will help you set up and run the AI Wireless CallTones application locally.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4.4 or higher)

## Project Structure

```
AI-Wireless-CallTones-App/
├── backend/           # Node.js/Express backend
│   ├── src/
│   │   ├── config/    # Configuration files
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/    # Database models
│   │   ├── routes/    # API routes
│   │   └── server.js  # Main server file
│   ├── uploads/       # Local file storage (created automatically)
│   └── package.json
├── frontend/          # React.js frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── contexts/    # React contexts
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── App.js       # Main app component
│   └── package.json
└── README.md
```

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ai-wireless-calltones

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=audio/mpeg,audio/mp3,audio/wav,audio/ogg

# AWS S3 Configuration (Optional - for cloud storage)
# Leave empty to use local storage
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux with systemd
sudo systemctl start mongod

# Or run MongoDB directly
mongod --dbpath /path/to/your/data/directory
```

### 4. Start the Backend Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The backend server will start on `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the frontend directory:

```bash
cp .env.example .env
```

Edit the `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start the Frontend Development Server

```bash
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## Usage

### 1. Sign Up / Login

- Navigate to `http://localhost:3000`
- You'll be redirected to the login page
- Click "Sign up" to create a new account
- Enter your username, email, and password
- After successful registration, you'll be logged in automatically

### 2. Upload Call Tones

- On the dashboard, use the file uploader to select an audio file
- Supported formats: MP3, WAV, OGG
- Maximum file size: 10MB
- Add a title and optional description
- Choose whether to make it public
- Click "Upload Call Tone"

### 3. Select Call Tones

- Browse your uploaded call tones and AI-generated tones using the tabs
- Click "Select" on any call tone to set it as your active ringtone
- Selected tones will be highlighted

### 4. Play Call Tones

- When you select a call tone, it will appear in the "Now Playing" section
- Use the media player controls to play, pause, and seek through the audio

## Cloud Storage Setup (Optional)

To use AWS S3 for file storage instead of local storage:

### 1. Create an AWS S3 Bucket

1. Log in to AWS Console
2. Navigate to S3
3. Create a new bucket (e.g., `ai-wireless-calltones`)
4. Configure bucket permissions for public read access (if needed)

### 2. Create IAM Credentials

1. Navigate to IAM in AWS Console
2. Create a new user with programmatic access
3. Attach the `AmazonS3FullAccess` policy (or create a custom policy)
4. Save the Access Key ID and Secret Access Key

### 3. Update Backend .env

```env
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

### 4. Restart the Backend Server

The application will automatically use S3 for file storage when AWS credentials are configured.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires authentication)

### Call Tones
- `GET /api/calltones` - Get all call tones
- `GET /api/calltones/ai-generated` - Get AI-generated call tones
- `GET /api/calltones/:id` - Get single call tone
- `POST /api/calltones/upload` - Upload a call tone (requires authentication)
- `DELETE /api/calltones/:id` - Delete a call tone (requires authentication)
- `PUT /api/calltones/:id/select` - Select a call tone (requires authentication)

### Health Check
- `GET /api/health` - Check server status

## Rate Limiting

The application implements rate limiting to prevent abuse:

- **Authentication endpoints** (`/api/auth/signup`, `/api/auth/login`): 5 requests per 15 minutes per IP
- **File upload endpoint** (`/api/calltones/upload`): 10 uploads per hour per IP
- **General API endpoints**: 100 requests per 15 minutes per IP

If you exceed the rate limit, you'll receive a 429 (Too Many Requests) response.

## Troubleshooting

### MongoDB Connection Issues

If you see "MongoDB connection error":
1. Ensure MongoDB is running
2. Check the `MONGODB_URI` in your `.env` file
3. Verify MongoDB is accessible at the specified URI

### CORS Errors

If you see CORS errors in the browser console:
1. Ensure the backend is running
2. Check that `FRONTEND_URL` in backend `.env` matches your frontend URL
3. Verify the `REACT_APP_API_URL` in frontend `.env` is correct

### File Upload Issues

If file uploads fail:
1. Check file size (must be under 10MB)
2. Verify file format (MP3, WAV, or OGG)
3. Ensure the `uploads/` directory exists and is writable (for local storage)
4. For S3, verify AWS credentials are correct

### Port Already in Use

If port 5000 or 3000 is already in use:
1. Kill the process using that port
2. Or change the port in `.env` files

## Production Deployment

### Backend Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name calltones-backend
   ```
3. Configure a reverse proxy (nginx) if needed
4. Use a production MongoDB instance (MongoDB Atlas recommended)

### Frontend Deployment

1. Build the production version:
   ```bash
   npm run build
   ```
2. Deploy the `build/` directory to a static hosting service:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Or serve with nginx

3. Update `REACT_APP_API_URL` to point to your production backend

## Security Considerations

1. **Change JWT Secret**: Use a strong, random secret in production
2. **Environment Variables**: Never commit `.env` files to version control
3. **HTTPS**: Use HTTPS in production for both frontend and backend
4. **CORS**: Restrict CORS to your frontend domain in production
5. **File Validation**: The app validates file types and sizes on upload
6. **Authentication**: All protected routes require valid JWT tokens

## License

This project is licensed under the ISC License.
