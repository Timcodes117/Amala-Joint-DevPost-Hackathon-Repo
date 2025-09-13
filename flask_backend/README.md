# Flask MongoDB Backend

A simple Flask backend application with MongoDB integration, designed for hosting on PythonAnywhere.

## Features

- JWT-based authentication system
- User registration and login
- Password hashing with bcrypt
- RESTful API endpoints for user management
- MongoDB integration with PyMongo
- CORS support for frontend integration
- Environment-based configuration
- Health check endpoint
- Error handling and validation
- Modular route structure

## API Endpoints

### Health Check
- `GET /api/health` - Check application and database status

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user and get JWT tokens
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify` - Verify token validity

### Users (Protected Routes)
- `GET /api/users/` - Get all users (requires JWT)
- `GET /api/users/<user_id>` - Get a specific user (requires JWT)
- `PUT /api/users/<user_id>` - Update a user (requires JWT)
- `DELETE /api/users/<user_id>` - Delete a user (requires JWT)
- `GET /api/users/profile` - Get current user's profile (requires JWT)
- `PUT /api/users/profile` - Update current user's profile (requires JWT)

## Setup Instructions

### Local Development

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up MongoDB:**
   - Install MongoDB locally or use MongoDB Atlas
   - Update the `MONGODB_URI` in your environment variables

3. **Configure environment:**
   ```bash
   cp config.env.example .env
   # Edit .env with your MongoDB connection details
   ```

4. **Run the application:**
   ```bash
   python app.py
   ```

### PythonAnywhere Deployment

1. **Upload your files** to PythonAnywhere:
   - Upload `app.py`, `requirements.txt`, and `wsgi.py`
   - Update `wsgi.py` with your correct username and path

2. **Install dependencies** in the PythonAnywhere console:
   ```bash
   pip3.10 install --user -r requirements.txt
   ```

3. **Configure MongoDB:**
   - Use MongoDB Atlas (recommended) or another cloud MongoDB service
   - Update your environment variables with the cloud MongoDB URI

4. **Set up the web app:**
   - Go to the Web tab in PythonAnywhere
   - Create a new web app
   - Choose "Manual configuration" and Python 3.10
   - Set the source code path to your project directory
   - Update the WSGI configuration file path to point to your `wsgi.py`

5. **Environment variables:**
   - Add your MongoDB URI and other environment variables in the Web tab
   - Or create a `.env` file in your project directory

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `DATABASE_NAME`: Name of your MongoDB database
- `JWT_SECRET_KEY`: Secret key for JWT token signing (change in production!)
- `FLASK_ENV`: Flask environment (development/production)
- `FLASK_DEBUG`: Enable/disable debug mode

## Example API Usage

### Register a new user:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "SecurePass123"}'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "SecurePass123"}'
```

### Get current user (with JWT token):
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update user profile:
```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe", "age": 31}'
```

## Project Structure

```
flask_backend/
├── app.py                 # Main Flask application
├── wsgi.py               # WSGI configuration for PythonAnywhere
├── requirements.txt      # Python dependencies
├── config.env.example    # Environment variables template
├── routes/               # API route modules
│   ├── __init__.py
│   ├── auth.py          # Authentication routes
│   └── users.py         # User management routes
├── models/               # Data models
│   ├── __init__.py
│   └── user.py          # User model
├── utils/                # Utility functions
│   ├── __init__.py
│   └── auth_utils.py    # Authentication utilities
└── README.md            # This file
```

## Notes

- The application uses PyMongo for MongoDB operations
- JWT tokens are used for authentication with access and refresh tokens
- Passwords are hashed using bcrypt for security
- CORS is enabled for frontend integration
- All API responses follow a consistent JSON format
- Error handling is implemented for common scenarios
- The application is ready for production deployment on PythonAnywhere
- User routes are protected and require valid JWT tokens
- Email validation and password strength requirements are enforced
