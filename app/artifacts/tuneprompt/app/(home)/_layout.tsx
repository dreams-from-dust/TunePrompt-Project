import { useAuth } from "@clerk/expo";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Icon } from "@/components/Icon";

export default function HomeLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const colors = useColors();
  const [showAnyway, setShowAnyway] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowAnyway(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded && !showAnyway) return null;
  if (!isSignedIn && isLoaded) return <Redirect href="/(auth)/sign-in" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: "#0E0E12",
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 0,
          height: Platform.OS === "ios" ? 80 : 60,
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: "Inter_500Medium",
        },
        tabBarBackground: () => (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: "#0E0E12" }]} />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="generate"
        options={{
          title: "Generate",
          tabBarIcon: ({ color, size }) => (
            <Icon name="zap" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Icon name="clock" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
