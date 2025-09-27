# 🔥 Firebase Unauthorized Domain Fix Guide

## 🚨 **Current Error**: `Firebase: Error (auth/unauthorized-domain)`

This error means your current domain is not authorized for Firebase Authentication.

## ✅ **Step-by-Step Fix:**

### 1. **Go to Firebase Console**
1. **Navigate to**: https://console.firebase.google.com/
2. **Select your project**: `amala-joint`
3. **Go to Authentication**:
   - Click "Authentication" in the left sidebar
   - Click "Sign-in method" tab

### 2. **Add Authorized Domains**
1. **Scroll down** to the "Authorized domains" section
2. **Click "Add domain"**
3. **Add these domains** (one by one):

#### **For Development:**
- `localhost` (for local development)
- `127.0.0.1` (alternative localhost)
- `localhost:3000` (if using port 3000)
- `localhost:3001` (if using different port)

#### **For Production:**
- `amala-joint.vercel.app` (your Vercel domain)
- `amala-joint-git-main-yourusername.vercel.app` (Vercel preview domain)
- Any other domains you're using

### 3. **Common Domain Patterns to Add:**

```
localhost
127.0.0.1
localhost:3000
localhost:3001
amala-joint.vercel.app
*.vercel.app
```

### 4. **Save Changes**
- Click "Save" after adding each domain
- Wait for changes to propagate (usually instant)

## 🔍 **How to Check Your Current Domain:**

### **In Development:**
- Look at your browser's address bar
- Usually: `http://localhost:3000` or `http://127.0.0.1:3000`

### **In Production:**
- Check your Vercel deployment URL
- Usually: `https://amala-joint.vercel.app`

## 🚀 **Quick Test:**

1. **Add `localhost` to authorized domains**
2. **Refresh your browser**
3. **Try Google sign-in again**
4. **Should work immediately!**

## 📋 **Current Firebase Config:**

Your Firebase project: `amala-joint`
- **Project ID**: `amala-joint`
- **Auth Domain**: `amala-joint.firebaseapp.com`

## ⚠️ **Important Notes:**

1. **Wildcard domains** (`*.vercel.app`) are supported
2. **Subdomains** need to be added separately
3. **HTTPS required** for production domains
4. **Changes are instant** - no waiting required

## 🎯 **Expected Result:**

After adding your domain to authorized domains:
- ✅ No more `auth/unauthorized-domain` error
- ✅ Google sign-in popup should open
- ✅ Authentication should work perfectly

---

**Note**: This is a Firebase project configuration issue, not a code problem. Your code is correct!
