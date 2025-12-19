# AI Wireless CallTones App

A full-stack application that allows users to replace standard phone ringing sounds with customizable audio files. Users can upload their own audio content or choose from AI-generated call tones.

## Features

### 🎵 Call Tone Management
- Upload custom audio files (MP3, WAV, OGG)
- Browse and select from AI-generated call tones
- Play and preview call tones before selection
- Organize call tones with titles, descriptions, and tags
- Mark call tones as public or private

### 🔐 Authentication & Authorization
- Secure user registration and login
- JWT-based authentication
- Protected routes requiring authentication
- Session management with token persistence

### 🎨 User Interface
- Responsive design for all devices
- Intuitive dashboard for managing call tones
- Built-in media player with playback controls
- Drag-and-drop file uploader
- Tabbed interface for organizing content

### ☁️ Cloud Integration
- Support for local file storage
- Optional AWS S3 integration for scalable cloud storage
- Automatic fallback to local storage

### 🛡️ Security Features
- Password hashing with bcrypt
- JWT token-based authentication
- File type and size validation
- Input validation and sanitization
- Error handling and logging

## Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File upload handling
- **AWS S3** - Cloud storage (optional)

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4.4 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ng4rnzz69c-byte/AI-Wireless-CallTones-App.git
   cd AI-Wireless-CallTones-App
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## Documentation

- [Setup Guide](SETUP.md) - Detailed installation and configuration instructions
- [API Documentation](API.md) - Complete API reference with examples

## Project Structure

```
AI-Wireless-CallTones-App/
├── backend/                 # Backend application
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── server.js       # Server entry point
│   ├── .env.example        # Environment variables template
│   └── package.json
├── frontend/               # Frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.js         # App entry point
│   ├── .env.example       # Environment variables template
│   └── package.json
├── API.md                 # API documentation
├── SETUP.md              # Setup guide
└── README.md             # This file
```

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-wireless-calltones
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=audio/mpeg,audio/mp3,audio/wav,audio/ogg
AWS_ACCESS_KEY_ID=your_aws_key (optional)
AWS_SECRET_ACCESS_KEY=your_aws_secret (optional)
AWS_REGION=us-east-1 (optional)
AWS_S3_BUCKET=your_bucket (optional)
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Key Features Implementation

### Authentication Flow
1. User signs up with username, email, and password
2. Password is hashed using bcrypt
3. JWT token is generated and returned
4. Token is stored in localStorage
5. Token is included in subsequent API requests
6. Protected routes check for valid token

### File Upload Process
1. User selects audio file via drag-and-drop or file picker
2. File is validated (type, size) on client and server
3. File is uploaded to server (local or S3)
4. Metadata is stored in MongoDB
5. File URL is returned to client

### Call Tone Selection
1. User browses available call tones
2. User clicks "Select" on desired tone
3. Selected tone is associated with user profile
4. Selected tone is highlighted in UI
5. Selected tone can be played using media player

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Call Tones
- `GET /api/calltones` - Get all call tones
- `GET /api/calltones/ai-generated` - Get AI-generated tones
- `GET /api/calltones/:id` - Get specific call tone
- `POST /api/calltones/upload` - Upload new call tone
- `PUT /api/calltones/:id/select` - Select call tone
- `DELETE /api/calltones/:id` - Delete call tone

See [API.md](API.md) for detailed documentation.

## Database Schema

### User Model
```javascript
{
  username: String (required, unique)
  email: String (required, unique)
  password: String (required, hashed)
  selectedCallTone: ObjectId (ref: CallTone)
  createdAt: Date
}
```

### CallTone Model
```javascript
{
  title: String (required)
  description: String
  fileUrl: String (required)
  fileType: String (required)
  fileSize: Number (required)
  duration: Number
  uploadedBy: ObjectId (ref: User)
  isAIGenerated: Boolean
  isPublic: Boolean
  category: String (enum)
  tags: [String]
  createdAt: Date
}
```

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days (configurable)
- File uploads are validated for type and size
- Authentication required for all protected routes
- CORS configured to allow only frontend domain
- Environment variables for sensitive data
- Input validation on all API endpoints

## Performance & Scalability

- MongoDB indexing on frequently queried fields
- Cloud storage (S3) for handling large file volumes
- Pagination support for large datasets
- Efficient file upload with streaming
- Connection pooling for database
- Compression for API responses

## Future Enhancements

- [ ] AI-powered call tone generation
- [ ] Call tone categories and search
- [ ] User ratings and reviews
- [ ] Social sharing features
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration
- [ ] Analytics dashboard
- [ ] Advanced audio editing tools
- [ ] Subscription tiers
- [ ] Admin panel

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub. 
