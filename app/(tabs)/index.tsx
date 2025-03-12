import {
  Image,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "@/components/useColorScheme";

import { Text, View } from "@/components/Themed";
import Balance from "@/components/Index/Balance";
import Budgets from "@/components/Index/Budgets";
import Header from "@/components/Header";
import Greeting from "@/components/Index/Greeting";
import NotificationsFlatList from "@/components/Index/NotificationsFlatList";
import RecentTransFlatList from "@/components/Index/RecentTransFlatList";

import { useAnalytics } from "@/context/analytics";
import { StatusBar } from "expo-status-bar";
import { useUserData } from "@/context/user";
import Slider from "../slider";

const GradientImage = require("@/assets/pages/gradientBg.png");

export default function TabOne() {
  const colorScheme = useColorScheme();
  const { analytics, fetchAnalytics } = useAnalytics();
  const { userDetails, fetchUserDetails } = useUserData();

  const [sliderVisible, setSliderVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!analytics.totalAmount) fetchAnalytics();
    if (!userDetails) fetchUserDetails();
  }, []);

  async function refreshPage() {
    setRefresh(true);

    try {
      console.log("Fetching on Reload");

      await fetchAnalytics();
      await fetchUserDetails();
    } catch (error) {
      console.error("Error Refreshing: ", error);
    } finally {
      setRefresh(false);
    }
  }

  function showSlider() {
    setSliderVisible(true);
  }
  function hideSlider() {
    setSliderVisible(false);
  }

  return (
    <View
      style={[
        styles.conatiner,
        { backgroundColor: colorScheme === "dark" ? "#1C1C1C" : "#EDEDED" },
      ]}
    >
      <StatusBar backgroundColor={"transparent"} />

      <Image
        source={GradientImage}
        style={{
          position: "absolute",
          zIndex: 0,
          height: 250,
          objectFit: "cover",
        }}
      />

      <View style={styles.bodyContainer}>
        <Header showSlider={showSlider} />

        <Slider isVisible={sliderVisible} hideSlider={hideSlider} />

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => refreshPage()}
              colors={["#000"]}
            />
          }
          style={styles.paddings}
        >
          <Greeting />

          <Balance />

          <NotificationsFlatList />

          <RecentTransFlatList />

          <Budgets clickable />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
  },
  bodyContainer: {
    flex: 1,
    position: "relative",
    backgroundColor: "transparent",
  },
  paddings: {
    padding: 15,
    paddingTop: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
