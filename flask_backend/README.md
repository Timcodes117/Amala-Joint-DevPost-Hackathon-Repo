# 🍲 Amala Joint - AI-Powered Restaurant Discovery Backend

> **Live Demo**: [https://amala-joint-devpost-hackathon-repo-6uvv.onrender.com/](https://amala-joint-devpost-hackathon-repo-6uvv.onrender.com/)

An intelligent Flask backend that uses **Google Cloud AI tools** and **agentic workflows** to help users discover the best Amala (Nigerian cuisine) restaurants. Built with Google Maps API, Gemini AI, and Google ADK for seamless restaurant recommendations and navigation.

## 🚀 Features

- 🤖 **AI-Powered Restaurant Discovery** using Google Gemini
- 🗺️ **Google Maps Integration** for location-based recommendations
- 🔄 **Agentic Workflow** with Google ADK for intelligent task orchestration
- 🌍 **Multi-language Support** (English/Yoruba) with translation
- 🔐 **JWT Authentication** with MongoDB
- 📧 **Email Verification** system
- ☁️ **Cloudinary Integration** for image uploads
- 🚀 **Production Ready** with Render deployment

## 🏃‍♂️ Quick Start

### Option 1: Use Live API
```bash
# API is live at:
curl https://amala-joint-devpost-hackathon-repo-6uvv.onrender.com/api/health
```

### Option 2: Run Locally

```bash
# 1. Clone and install dependencies
git clone <your-repo>
cd flask_backend
pip install -r requirements.txt

# 2. Set up environment variables
cp config.env.example config.env
# Edit config.env with your API keys

# 3. Run the server
python wsgi.py
```

Server starts at `http://localhost:5000`

## 🛠️ API Endpoints

### 🏠 Core
- `GET /` - App status and info
- `GET /api/health` - Health check

### 🔐 Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify` - Verify token

### 🤖 AI-Powered Features
- `POST /api/ai/chat` - AI chat with restaurant recommendations
- `POST /api/ai/find` - Find Amala restaurants near location
- `POST /api/ai/plan` - Plan restaurant visits
- `POST /api/ai/navigate` - Get directions to restaurants
- `POST /api/translate` - Translate text (English ↔ Yoruba)

### 📚 API Documentation
- `GET /api/docs` - Interactive Swagger UI documentation
- `GET /api/docs/swagger.yaml` - OpenAPI specification
- `GET /api/docs/redoc` - ReDoc documentation

### 👥 User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### 🏪 Store Management
- `GET /api/stores` - List restaurants
- `POST /api/stores` - Add new restaurant
- `GET /api/stores/{id}` - Get restaurant details

## 🤖 Agentic Workflow Architecture

Our backend uses **Google Cloud AI tools** in an intelligent agentic workflow:

### 🔄 Workflow Components

1. **Router Agent** - Analyzes user queries and routes to appropriate specialists
2. **Amala Finder Agent** - Uses Google Maps API to find restaurants
3. **Planner Agent** - Creates restaurant visit plans
4. **Navigation Agent** - Provides directions using Google Maps
5. **Translation Agent** - Handles English ↔ Yoruba translation

### 🛠️ Google Cloud Tools Used

- **Google Gemini AI** - Natural language processing and recommendations
- **Google Maps API** - Location services and restaurant data
- **Google ADK (Agent Development Kit)** - Agent orchestration and workflow management
- **Google Places API** - Restaurant information and reviews
- **Deep Translator** - Language translation services

### 🔧 Technical Stack

```python
# Core AI Components
- google-generativeai==0.8.5      # Gemini AI
- google-adk==1.14.1              # Agent Development Kit
- google-api-python-client==2.182.0  # Maps & Places API
- deep-translator==1.11.4         # Translation services

# Backend Framework
- flask==3.1.2                    # Web framework
- flask-jwt-extended==4.7.1       # Authentication
- flask-mail==0.10.0              # Email services
- pymongo==4.15.1                 # MongoDB integration
- cloudinary==1.41.0              # Image uploads
```

## 🔑 Environment Variables

Create a `config.env` file with:

```bash
# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key

# MongoDB Configuration
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/
DATABASE_NAME=amala

# Google Cloud APIs
GOOGLE_API_KEY=your-google-api-key

# Email Configuration
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🚀 Deployment

### Render Deployment
```bash
# 1. Connect your GitHub repo to Render
# 2. Set environment variables in Render dashboard
# 3. Use start command: gunicorn --bind 0.0.0.0:$PORT wsgi:app
# 4. Deploy!
```

## 🎯 Perfect For

- ✅ **Hackathons** - Quick AI-powered restaurant discovery
- ✅ **Food Tech** - Restaurant recommendation systems
- ✅ **Location Services** - Maps integration projects
- ✅ **AI/ML Projects** - Agentic workflow demonstrations
- ✅ **Nigerian Cuisine** - Cultural food discovery apps
- ✅ **Multi-language Apps** - Translation integration

## 📱 Frontend Integration

```typescript
// API Configuration
const API_BASE_URL = "https://amala-joint-devpost-hackathon-repo-6uvv.onrender.com";

// Example: Find restaurants
const findRestaurants = async (location: string) => {
  const response = await fetch(`${API_BASE_URL}/api/ai/find`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location, cuisine: 'amala' })
  });
  return response.json();
};
```

## 🏆 Hackathon Pitch Points

- **🤖 AI-Powered**: Uses Google Gemini for intelligent recommendations
- **🗺️ Location-Aware**: Google Maps integration for real restaurant data
- **🔄 Agentic Workflow**: Multiple AI agents working together
- **🌍 Multi-language**: English/Yoruba support for Nigerian users
- **☁️ Production Ready**: Deployed on Render with full CI/CD
- **📱 Mobile Ready**: RESTful API for any frontend framework

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with the live API
5. Submit a pull request

## 📄 License

MIT License - Perfect for hackathons and open source projects!