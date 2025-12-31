# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack Instagram clone built with Node.js/Express backend and vanilla JavaScript frontend. It features user authentication, posts, comments, likes, and a follow system.

## Development Commands

### Backend (Node.js/Express)
```bash
# Install dependencies
npm install

# Development (with auto-reload via nodemon)
npm run dev

# Production
npm start

# The backend server runs on http://localhost:5000 (PORT in .env)
```

### Frontend
No build step required - vanilla JavaScript with static HTML pages served on a separate port.

## Architecture & Structure

### Backend: Express.js + MongoDB

**Route Organization:**
- `/api/auth` - Authentication (register, login, token verification)
- `/api/users` - User profiles, follow/unfollow, user search
- `/api/posts` - CRUD operations, likes, feed aggregation
- `/api/posts/:postId/comments` - Comments and comment likes

**Database Models (MongoDB):**

1. **User Schema** (`backend/models/User.js`)
   - Key fields: username, email, password (hashed), fullName, bio, profilePicture, followers, following
   - Methods: `matchPassword()` for authentication
   - Pre-save hook automatically hashes passwords with bcrypt

2. **Post Schema** (`backend/models/Post.js`)
   - Key fields: author, imageUrl, caption, location, tags, likes (array of user IDs), comments, likesCount
   - Denormalized counts for query efficiency

3. **Comment Schema** (`backend/models/Comment.js`)
   - Key fields: post, author, text, likes, likesCount

**Key Backend Patterns:**

- **MVC-like structure**: Routes → Controllers → Models
- **Auth Middleware** (`backend/middleware/auth.middleware.js`): JWT verification via Bearer token
- **Upload Middleware** (`backend/middleware/upload.middleware.js`): Multer + Cloudinary integration for image uploads
- **Pagination**: Feed and user posts use skip/limit pattern with `hasMore` flag for infinite scroll
- **Data Population**: Mongoose `.populate()` for relations, selective field projection to minimize data transfer
- **Authorization**: Controllers check resource ownership (users can only delete own posts/comments)
- **Security**: Helmet, CORS (CLIENT_URL only), rate limiting (5 auth attempts/15min, 100 general/15min)

### Frontend: Vanilla JavaScript

**Module Organization:**

- `frontend/js/config.js` - Single source of truth for API endpoints and base URL
- `frontend/js/utils/api.js` - APIClient class for HTTP requests with automatic Authorization headers
- `frontend/js/utils/auth.js` - Token and user persistence in localStorage
- `frontend/js/components/` - Reusable UI components (navbar, post cards)
- `frontend/js/pages/` - Page-specific logic (auth, feed, profile)

**Key Pages:**

1. **index.html** - Authentication (login/register)
   - Form validation, token storage, redirect to feed on success

2. **pages/feed.html** - Main feed
   - Sticky navbar with search (debounced 300ms)
   - Infinite scroll pagination
   - Post creation modal with image upload
   - Left sidebar nav, right sidebar suggestions, footer navbar (mobile)

3. **pages/profile.html** - User profile
   - Profile header with follow button
   - 3-column posts grid with pagination
   - Story highlights section (UI placeholder)

**Frontend Data Flow:**
1. Token stored in localStorage after auth
2. APIClient automatically adds Bearer token to all requests
3. Fetch data from backend, render UI with DOM manipulation
4. No framework - direct event listeners and DOM updates

## Environment Setup

Create a `.env` file in the project root with:

```
PORT=5000
NODE_ENV=development

# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/instagram-clone

# JWT configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend CORS origin
CLIENT_URL=http://localhost:3000
```

## Important Configuration Files

- `backend/config/database.js` - MongoDB connection setup
- `backend/config/cloudinary.js` - Image upload service configuration
- `backend/utils/jwt.js` - Token generation and verification
- `frontend/js/config.js` - API endpoint definitions

## Adding New Features

### Adding a Backend API Endpoint

1. **Define the route** in `backend/routes/` (e.g., `userRoutes.js`)
   - Use `router.get()`, `router.post()`, etc.
   - Apply `protect` middleware for protected routes

2. **Implement the controller** in `backend/controllers/` (e.g., `userController.js`)
   - Use try-catch for error handling
   - Validate input with express-validator if needed
   - Query the model and populate relations as needed
   - Return appropriate HTTP status codes

3. **Update the model** in `backend/models/` if the data structure changes
   - Define schema fields and types
   - Add indexes for frequently queried fields
   - Include pre-save hooks for data transformation (e.g., password hashing)

4. **Register the route** in `backend/server.js`

5. **Add endpoint to frontend** in `frontend/js/config.js` API_ENDPOINTS object

### Adding Frontend UI Components

1. Create component in `frontend/js/components/component-name.js`
2. Export a function that takes data and returns HTML or manages state
3. Use APIClient from `utils/api.js` for HTTP requests
4. Include proper error handling and loading states
5. Add event listeners for user interactions
6. Import and use in the appropriate page file

## Common Development Tasks

### Debugging

- Backend: Use `console.log()` - output appears in terminal running `npm run dev`
- Frontend: Browser DevTools Console (F12) shows logs and errors
- Check MongoDB documents directly using MongoDB Atlas web interface

### Testing API Endpoints

Use curl or Postman to test endpoints manually:

```bash
# Create a post with image (after getting auth token from /api/auth/login)
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "caption=My post caption"

# Get feed
curl -X GET "http://localhost:5000/api/posts/feed?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Modifying Database Queries

- Use `.select()` to include/exclude fields: `.find().select('username profilePicture')`
- Use `.populate('fieldName')` to fetch references
- Use `.limit()` and `.skip()` for pagination
- Use `.sort({createdAt: -1})` for ordering

### Image Uploads

- Images are uploaded to Cloudinary (not stored locally)
- File size limited to 5MB, allowed types: JPEG, PNG, WebP, GIF
- Multer validates MIME type before sending to Cloudinary
- Configure folder structure in `backend/config/cloudinary.js` if needed

## Code Patterns to Follow

### Authentication

Protected routes should use the `protect` middleware:

```javascript
router.post('/create', protect, postController.createPost);
```

The `protect` middleware attaches the authenticated user to `req.user`.

### Error Handling

Controllers use consistent try-catch pattern. Return appropriate status codes:
- 200/201 for success
- 400 for bad request
- 401 for unauthorized
- 403 for forbidden (resource ownership check)
- 404 for not found
- 500 for server errors

### Response Format

Controllers return JSON with consistent structure. Include data and appropriate HTTP status.

### Frontend API Calls

Use the APIClient class from `utils/api.js`:

```javascript
const apiClient = new APIClient();
const response = await apiClient.post('/posts', formData, { isFormData: true });
```

The APIClient automatically:
- Adds Authorization header with JWT token
- Handles JSON and FormData requests
- Provides error information

## Database Indexes

Key indexes are defined in model schemas for query performance:
- User: `username`, `email`, `createdAt`
- Post: `author+createdAt`, `tags`, `likes`
- Comment: `post+createdAt`, `author`

## Rate Limiting

The backend implements rate limiting:
- Auth endpoints: 5 requests per 15 minutes per IP
- General endpoints: 100 requests per 15 minutes per IP

This prevents brute force attacks and API abuse.

## Security Considerations

- Passwords are hashed with bcrypt (salt rounds: 10) and never returned in API responses
- JWT tokens expire after 7 days
- CORS restricted to CLIENT_URL only
- File uploads validated by MIME type and size
- Form data validated on the backend
- Rate limiting on sensitive endpoints
- Helmet sets security headers

## File Upload Flow

1. Frontend: User selects image via file input
2. Frontend: APIClient sends FormData with Bearer token
3. Backend: Multer validates file (MIME type, size 5MB max)
4. Backend: Cloudinary uploads the file
5. Backend: Returns URL in Post response
6. Frontend: Displays image in post card

