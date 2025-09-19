# Flask Backend - Amala App (No Database Required!)

A Flask backend with JWT authentication for the Amala app. **No MongoDB required** - uses in-memory storage for easy testing!

## Features

- ✅ User authentication (login/signup)
- ✅ JWT token management
- ✅ In-memory storage (no database setup needed!)
- ✅ Password validation
- ✅ Email validation
- ✅ CORS support for frontend
- ✅ Pre-loaded test users

## Quick Start

### 1. Install Dependencies

```bash
# Using pip
pip install -r requirements.txt
```

### 2. Run the Server

```bash
# Start with test users
python start_server.py

# Or start normally
python app.py
```

The server will start at `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify` - Verify token

### Health Check

- `GET /api/health` - Check server status

## Test Credentials

The server comes with pre-loaded test users:

- **Email:** john@example.com, **Password:** password123
- **Email:** jane@example.com, **Password:** password123  
- **Email:** amala@example.com, **Password:** amala123

## Frontend Integration

Update your frontend API base URL to:
```typescript
const API_BASE_URL = "http://localhost:5000";
```

## Dependencies

- Flask
- Flask-CORS
- Flask-JWT-Extended
- python-dotenv

## Environment Variables (Optional)

- `JWT_SECRET_KEY` - Secret key for JWT tokens (defaults to test key)
- `PORT` - Server port (default: 5000)
- `HOST` - Server host (default: 0.0.0.0)

## How It Works

- **In-Memory Storage**: Users stored in Python dictionary
- **No Database**: Perfect for testing and development
- **Real JWT Tokens**: Full authentication flow
- **Session Persistence**: Data persists while server runs
- **Easy Testing**: Pre-loaded users ready to use

## Perfect For

- ✅ **Testing** your app's authentication
- ✅ **Development** without database setup
- ✅ **Demos** and presentations
- ✅ **Hackathons** where you need quick setup
- ✅ **Learning** authentication concepts