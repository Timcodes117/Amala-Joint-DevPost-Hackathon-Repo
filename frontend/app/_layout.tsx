import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { font_name, font_name_bold } from "../utils/constants/app_constants";

SplashScreen.preventAutoHideAsync()

export default function Layout() {
    const [loaded, error] = useFonts({
    [font_name]: require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    [font_name_bold]: require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded) {
    return null;
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Home", headerShown: false }}   />
    </Stack>
  );
}
   