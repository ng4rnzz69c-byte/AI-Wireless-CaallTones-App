# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. After logging in or signing up, include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

---

## Endpoints

### Authentication

#### Sign Up

Create a new user account.

**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f5e8a3b234567890abcdef",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "email already exists"
}
```

---

#### Login

Authenticate an existing user.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f5e8a3b234567890abcdef",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

#### Get Current User

Get the currently authenticated user's information.

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "64f5e8a3b234567890abcdef",
    "username": "johndoe",
    "email": "john@example.com",
    "selectedCallTone": {
      "_id": "64f5e8a3b234567890abcdef",
      "title": "My Ringtone",
      "fileUrl": "https://..."
    }
  }
}
```

---

### Call Tones

#### Get All Call Tones

Retrieve all call tones (public tones and user's own tones).

**Endpoint:** `GET /calltones`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `category` (optional): Filter by category (`user-uploaded`, `ai-generated`, `default`)
- `isPublic` (optional): Filter by public status (`true` or `false`)

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "64f5e8a3b234567890abcdef",
      "title": "Cool Ringtone",
      "description": "A cool ringtone",
      "fileUrl": "http://localhost:5000/uploads/calltone-123456.mp3",
      "fileType": "audio/mpeg",
      "fileSize": 1024000,
      "uploadedBy": {
        "_id": "64f5e8a3b234567890abcdef",
        "username": "johndoe"
      },
      "isAIGenerated": false,
      "isPublic": true,
      "category": "user-uploaded",
      "tags": ["rock", "guitar"],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

#### Get AI-Generated Call Tones

Retrieve all AI-generated call tones.

**Endpoint:** `GET /calltones/ai-generated`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "64f5e8a3b234567890abcdef",
      "title": "AI Melody 1",
      "description": "AI-generated melody",
      "fileUrl": "http://localhost:5000/uploads/ai-tone-123456.mp3",
      "fileType": "audio/mpeg",
      "fileSize": 512000,
      "isAIGenerated": true,
      "isPublic": true,
      "category": "ai-generated",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

#### Get Single Call Tone

Retrieve a specific call tone by ID.

**Endpoint:** `GET /calltones/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f5e8a3b234567890abcdef",
    "title": "Cool Ringtone",
    "description": "A cool ringtone",
    "fileUrl": "http://localhost:5000/uploads/calltone-123456.mp3",
    "fileType": "audio/mpeg",
    "fileSize": 1024000,
    "uploadedBy": {
      "_id": "64f5e8a3b234567890abcdef",
      "username": "johndoe"
    },
    "isPublic": true,
    "category": "user-uploaded",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Call tone not found"
}
```

---

#### Upload Call Tone

Upload a new call tone.

**Endpoint:** `POST /calltones/upload`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file` (required): Audio file (MP3, WAV, OGG, max 10MB)
- `title` (optional): Title for the call tone
- `description` (optional): Description
- `isPublic` (optional): Make the tone public (`true` or `false`)
- `tags` (optional): Comma-separated tags

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64f5e8a3b234567890abcdef",
    "title": "My New Ringtone",
    "description": "My custom ringtone",
    "fileUrl": "http://localhost:5000/uploads/calltone-123456.mp3",
    "fileType": "audio/mpeg",
    "fileSize": 1024000,
    "uploadedBy": "64f5e8a3b234567890abcdef",
    "isPublic": false,
    "category": "user-uploaded",
    "tags": ["custom"],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid file type. Only audio files are allowed."
}
```

---

#### Select Call Tone

Set a call tone as the user's active ringtone.

**Endpoint:** `PUT /calltones/:id/select`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Call tone selected successfully",
  "data": {
    "_id": "64f5e8a3b234567890abcdef",
    "title": "Cool Ringtone",
    "fileUrl": "http://localhost:5000/uploads/calltone-123456.mp3"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Call tone not found"
}
```

---

#### Delete Call Tone

Delete a call tone (only the owner can delete their tones).

**Endpoint:** `DELETE /calltones/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Call tone deleted successfully"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Not authorized to delete this call tone"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Call tone not found"
}
```

---

### Health Check

#### Server Health

Check if the server is running.

**Endpoint:** `GET /health`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Error Responses

### Common Error Codes

- **400 Bad Request**: Invalid request data or validation error
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: User doesn't have permission for the action
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

---

## File Upload Constraints

- **Maximum File Size**: 10MB (configurable via `MAX_FILE_SIZE` environment variable)
- **Allowed File Types**: 
  - audio/mpeg
  - audio/mp3
  - audio/wav
  - audio/ogg
- **Storage**: Local storage by default, or AWS S3 if configured

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production use, consider adding rate limiting middleware to prevent abuse.

---

## CORS

The API allows cross-origin requests from the frontend URL specified in the `FRONTEND_URL` environment variable. In production, ensure this is set to your frontend domain.

---

## Example Usage with cURL

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Upload Call Tone
```bash
curl -X POST http://localhost:5000/api/calltones/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/audio.mp3" \
  -F "title=My Ringtone" \
  -F "description=A cool ringtone" \
  -F "isPublic=true"
```

### Get All Call Tones
```bash
curl -X GET http://localhost:5000/api/calltones \
  -H "Authorization: Bearer YOUR_TOKEN"
```
