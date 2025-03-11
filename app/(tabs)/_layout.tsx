import React, { useState } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import FingerprintAuth from "../biometric";

// TabBarIcon Component
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={26} style={{ marginBottom: -7 }} {...props} />;
}

// TabLayout Component
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const bgColor = colorScheme === "dark" ? "#1C1C1C" : "#EDEDED";

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return isAuthenticated ? ( // !important to change in production
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 60,
            // position: "absolute",
            bottom: 10,
            borderRadius: 20,
            marginHorizontal: 10,
            borderWidth: 0.5,
            borderColor: "#777777",
          },
          tabBarActiveTintColor: "#4FB92D",
          tabBarInactiveTintColor: "#4588DF",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="home" color={focused ? "#4FB92D" : "#4588DF"} />
            ),
          }}
        />
        <Tabs.Screen
          name="two"
          options={{
            title: "Transactions",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name="receipt"
                color={focused ? "#4FB92D" : "#4588DF"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="three"
          options={{
            title: "Graphs",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name="pie-chart"
                color={focused ? "#4FB92D" : "#4588DF"}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  ) : (
    <FingerprintAuth onAuthSuccess={() => setIsAuthenticated(true)} />
  );
}
