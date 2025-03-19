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
  const { loggedIn, loggedUserId } = useLogin();

  const { biometricFlag, fetchUserDetails, userDetails } = useUserData();
  const { fetchAnalytics, analytics } = useAnalytics();

  const colorScheme = useColorScheme();
  const bgColor = colorScheme === "dark" ? "#1C1C1C" : "#EDEDED";

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (loggedIn && loggedUserId) fetchData();
  }, [loggedIn, loggedUserId]);

  async function fetchData() {
    if (!userDetails) await fetchAnalytics();
    if (!analytics.totalSpent && !analytics.totalEarned && !analytics.totalAmount) await fetchUserDetails();
  }

  return !loggedIn ? (
    <Login />
  ) : biometricFlag && !isAuthenticated ? ( // If biometric is required but not yet authenticated
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
