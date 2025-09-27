# 🚀 Swagger Documentation Setup Guide

## ✅ **What I've Set Up:**

### 1. **Installed Required Packages**
```bash
pip install flask-restx flask-cors pyyaml flask-jwt-extended pymongo flask-mail python-dotenv bcrypt requests cloudinary
```

### 2. **Created Swagger Configuration**
- **`swagger_config.py`**: Flask-RESTX configuration with models
- **`swagger.py`**: Swagger routes for UI and YAML serving
- **`simple_swagger_app.py`**: Standalone Flask app with Swagger

### 3. **Updated Flask App**
- Integrated Swagger API into main Flask app
- Added Swagger blueprint registration
- Created response models for consistent API documentation

## 🎯 **Available Endpoints:**

### **Swagger Documentation:**
- **Swagger UI**: `http://localhost:5000/api/docs`
- **Swagger YAML**: `http://localhost:5000/api/docs/swagger.yaml`
- **Swagger JSON**: `http://localhost:5000/api/docs/swagger.json`

### **API Endpoints:**
- **Health Check**: `http://localhost:5000/api/health`
- **Root Info**: `http://localhost:5000/`

## 🚀 **How to Run:**

### **Option 1: Simple Swagger App (Recommended)**
```bash
cd flask_backend
python simple_swagger_app.py
```

### **Option 2: Full Flask App**
```bash
cd flask_backend
python -c "from app import create_app; app = create_app(); app.run(debug=True, port=5000)"
```

### **Option 3: Using WSGI**
```bash
cd flask_backend
gunicorn --bind 0.0.0.0:5000 wsgi:app
```

## 📚 **Features:**

### **Swagger UI Features:**
- ✅ Interactive API documentation
- ✅ Try-it-out functionality
- ✅ Request/response examples
- ✅ Authentication testing
- ✅ Model schemas
- ✅ Error handling documentation

### **API Documentation Includes:**
- 🔐 **Authentication**: JWT, Google OAuth
- 🍽️ **Store Management**: CRUD operations, verification
- 🤖 **AI Features**: Chat, restaurant discovery
- 🗺️ **Places API**: Google Places integration
- 👤 **User Management**: Profiles, preferences

## 🔧 **Configuration:**

### **Environment Variables:**
```bash
# Add to your .env file
FLASK_ENV=development
SECRET_KEY=your-secret-key
MONGODB_URI=mongodb://localhost:27017/amala_joint
JWT_SECRET_KEY=your-jwt-secret
```

### **Swagger Customization:**
- Edit `swagger.yaml` for API documentation
- Modify `swagger_config.py` for Flask-RESTX models
- Update `swagger.py` for custom routes

## 🎨 **Swagger UI Customization:**

The Swagger UI includes:
- **Custom styling** with Amala Joint branding
- **Interactive testing** for all endpoints
- **Model validation** and examples
- **Authentication testing** with JWT tokens
- **Download functionality** for API specs

## 📋 **Next Steps:**

1. **Start the server**: `python simple_swagger_app.py`
2. **Visit Swagger UI**: `http://localhost:5000/api/docs`
3. **Test endpoints**: Use the "Try it out" buttons
4. **Customize**: Edit `swagger.yaml` for your needs

## 🐛 **Troubleshooting:**

### **Common Issues:**
- **Missing dependencies**: Run `pip install -r requirements.txt`
- **YAML errors**: Check `swagger.yaml` syntax
- **CORS issues**: Ensure Flask-CORS is configured
- **Port conflicts**: Change port in app.run()

### **Debug Mode:**
```bash
export FLASK_ENV=development
python simple_swagger_app.py
```

## 🎉 **Success!**

Your Swagger documentation is now ready! You can:
- ✅ View interactive API docs
- ✅ Test all endpoints
- ✅ Share API specifications
- ✅ Generate client SDKs
- ✅ Validate API responses

**Happy coding!** 🚀✨
