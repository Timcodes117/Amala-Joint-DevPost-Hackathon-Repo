import React, { createContext, useContext, useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { GOOGLE_CONFIG } from '../utils/constants/google_config';
import { authService, User, LoginCredentials, SignupCredentials, STORAGE_KEYS } from '../utils/auth_service';

// Complete the auth session for better UX
WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (credentials: SignupCredentials) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true for initial auth check
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const redirectUri = AuthSession.makeRedirectUri();
  console.log(redirectUri);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CONFIG.CLIENT_ID,
      redirectUri,      // 👈 use the proxy-based redirect
      scopes: GOOGLE_CONFIG.SCOPES,
    },
    GOOGLE_CONFIG.DISCOVERY
  );

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Handle Google OAuth response
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      setIsLoading(true);
      
      fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${authentication?.accessToken}` },
      })
        .then((res) => res.json())
        .then(async (data) => {
          // Create user account in our backend
          const signupResult = await authService.signup({
            name: data.name,
            email: data.email,
            password: 'google_oauth_' + Date.now() // Dummy password for Google OAuth users
          });

          if (signupResult.success && signupResult.data) {
            // Store tokens
            await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, signupResult.data.access_token);
            await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, signupResult.data.refresh_token);
            await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(signupResult.data.user));
            
            setUser(signupResult.data.user);
            setIsAuthenticated(true);
            router.replace("home_screen/home");
          } else {
            // If user already exists, try to login
            const loginResult = await authService.login({
              email: data.email,
              password: 'google_oauth_' + Date.now()
            });

            if (loginResult.success && loginResult.data) {
              await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, loginResult.data.access_token);
              await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, loginResult.data.refresh_token);
              await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(loginResult.data.user));
              
              setUser(loginResult.data.user);
              setIsAuthenticated(true);
              router.replace("home_screen/home");
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
          setIsLoading(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [response]);

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const accessToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

      if (accessToken && userData) {
        // Verify token is still valid
        const verifyResult = await authService.verifyToken(accessToken);
        
        if (verifyResult.success) {
          const user = JSON.parse(userData);
          setUser(user);
          setIsAuthenticated(true);
        } else {
          // Token expired, try to refresh
          const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
          if (refreshToken) {
            const refreshResult = await authService.refreshToken(refreshToken);
            if (refreshResult.success && refreshResult.data) {
              await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, refreshResult.data.access_token);
              setUser(JSON.parse(userData));
              setIsAuthenticated(true);
            } else {
              // Refresh failed, clear storage
              await clearAuthData();
            }
          } else {
            await clearAuthData();
          }
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  // Clear authentication data
  const clearAuthData = async () => {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA
    ]);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      await promptAsync();
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setIsLoading(false);
    }
  };

  // Sign in with email and password
  const signInWithEmail = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const result = await authService.login(credentials);
      
      if (result.success && result.data) {
        // Store tokens and user data
        await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, result.data.access_token);
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, result.data.refresh_token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(result.data.user));
        
        setUser(result.data.user);
        setIsAuthenticated(true);
        router.replace("home_screen/home");
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with email and password
  const signUpWithEmail = async (credentials: SignupCredentials) => {
    try {
      setIsLoading(true);
      const result = await authService.signup(credentials);
      
      if (result.success && result.data) {
        // Store tokens and user data
        await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, result.data.access_token);
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, result.data.refresh_token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(result.data.user));
        
        setUser(result.data.user);
        setIsAuthenticated(true);
        router.replace("home_screen/home");
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Signup failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    await clearAuthData();
    router.replace("(auth)/login");
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
