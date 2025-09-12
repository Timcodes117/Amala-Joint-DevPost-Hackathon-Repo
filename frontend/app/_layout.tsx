import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { font_name, font_name_bold } from "../utils/constants/app_constants";
import AppContextProvider from "../contexts/app";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    [font_name]: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    [font_name_bold]: require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false); // 👈 control auth state
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    const checkAuth = async () => {
      // Replace with AsyncStorage / SecureStore check
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoggedIn(true); // 👈 set true if logged in
      setChecking(false);
    };
    checkAuth();
  }, []);

  if (!loaded || checking) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AppContextProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="home_screen" />
        ) : (
          <Stack.Screen name="(auth)" />
        )}
      </Stack>
    </AppContextProvider>
  );
}
