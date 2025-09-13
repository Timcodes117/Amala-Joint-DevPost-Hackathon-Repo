import React, { createContext, useContext, useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { router } from 'expo-router';
import { GOOGLE_CONFIG } from '../utils/constants/google_config';

// Complete the auth session for better UX
WebBrowser.maybeCompleteAuthSession();

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      setIsLoading(true);
      
      fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${authentication?.accessToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser({
            id: data.sub,
            name: data.name,
            email: data.email,
            picture: data.picture,
          });
          // Navigate to home screen after successful login
          router.replace("home_screen/home");
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

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      await promptAsync();
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    // Navigate back to login screen
    router.replace("(auth)/login");
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signInWithGoogle,
    signOut,
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
