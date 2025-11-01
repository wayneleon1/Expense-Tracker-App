import SafeScreen from "../components/SafeScreen";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import CustomSplashScreen from "../components/SplashScreen";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { Animated } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [appIsReady, setAppIsReady] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (error) {
      console.error("Font loading error:", error);
      // Still show the app even if fonts fail
      setAppIsReady(true);
    }
    if (loaded) {
      SplashScreen.hideAsync().catch((hideError) => {
        console.warn("Error hiding splash screen:", hideError);
      });
    }
  }, [loaded, error]);

  const onSplashComplete = () => {
    // Start fade-in animation for the main app
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setAppIsReady(true);
  };

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file"
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <SafeScreen>
        {!appIsReady ? (
          <CustomSplashScreen onFinish={onSplashComplete} />
        ) : (
          <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            <Slot />
          </Animated.View>
        )}
      </SafeScreen>
      <StatusBar style="dark" />
    </ClerkProvider>
  );
}
