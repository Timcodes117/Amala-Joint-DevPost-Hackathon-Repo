import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { font_name, font_name_bold } from "../utils/constants/app_constants";
import AppContextProvider from "../contexts/app";
import { AuthProvider, useAuth } from "../contexts/auth";
import { SavedPostsProvider } from "../contexts/savedPosts";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

// Inner component that uses auth context
function RootLayoutContent() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="home_screen" />
      ) : (
        <Stack.Screen name="index" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    [font_name]: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    [font_name_bold]: require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppContextProvider>
          <SavedPostsProvider>
            <RootLayoutContent />
          </SavedPostsProvider>
        </AppContextProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
