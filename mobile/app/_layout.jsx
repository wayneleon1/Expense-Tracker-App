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
    if (loaded) {
      // Hide the native splash when both fonts and i18n are ready
      SplashScreen.hideAsync().catch((hideError) => {
        console.warn("Error hiding splash screen:", hideError);
      });
    }
  }, [loaded]);

  const onSplashComplete = () => {
    // Start fade-in animation for the main app
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setAppIsReady(true);
  };

  return (
    <ClerkProvider tokenCache={tokenCache}>
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
