import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import FingerprintAuth from "../biometric";
import { useUserData } from "@/context/user";
import { useAnalytics } from "@/context/analytics";
import { useLogin } from "@/context/login";
import Login from "../login";

// TabBarIcon Component
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={26} style={{ marginBottom: -7 }} {...props} />;
}

// TabLayout Component
export default function TabLayout() {
  const { biometricFlag, userDetails, fetchUserDetails } = useUserData();
  const { analytics, fetchAnalytics } = useAnalytics();

  const { loggedIn } = useLogin();

  const colorScheme = useColorScheme();
  const bgColor = colorScheme === "dark" ? "#1C1C1C" : "#EDEDED";

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!analytics.totalAmount) fetchAnalytics();
    if (!userDetails) fetchUserDetails();
  }, []);

  // !loggedIn ? (
  //   <Login />
  // ) :
  return biometricFlag && !isAuthenticated ? ( // If biometric is required but not yet authenticated
    <FingerprintAuth onAuthSuccess={() => setIsAuthenticated(true)} />
  ) : (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 60,
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
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name="home" color={focused ? "#4FB92D" : "#4588DF"} />
            ),
          }}
        />
        <Tabs.Screen
          name="two"
          options={{
            title: "Transactions",
            tabBarIcon: ({ focused }) => (
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
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                name="pie-chart"
                color={focused ? "#4FB92D" : "#4588DF"}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
