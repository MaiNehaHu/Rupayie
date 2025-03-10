import {
  Image,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Button,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useColorScheme } from "@/components/useColorScheme";

import { Text, View } from "@/components/Themed";
// import Header from "@/components/Header";

import { useAnalytics } from "@/context/analytics";
import { StatusBar } from "expo-status-bar";
import { useUserData } from "@/context/user";
import Slider from "../slider";
import Filter from "@/components/Two/Filter";
import AllTypesDonut from "@/components/Three/AllTypesDonut";
import TypesIndicator from "@/components/Three/TypesIndicators";
import TypesSquares from "@/components/Three/TypesSquares";

// const GradientImage = require("@/assets/pages/gradientBg.png");

export default function TabThreeScreen() {
  const colorScheme = useColorScheme();
  const { analytics, fetchAnalytics } = useAnalytics();
  const { userDetails, fetchUserDetails } = useUserData();

  const [refresh, setRefresh] = useState(false);
  const [sliderVisible, setSliderVisible] = useState(false);

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

      {/* <Image
        source={GradientImage}
        style={{
          position: "absolute",
          zIndex: 0,
          height: 85,
          objectFit: "cover",
        }}
      /> */}
      <View style={styles.bodyContainer}>
        {/* <Header showSlider={showSlider} /> */}

        <Text style={styles.headerText}>Analytics</Text>

        <Slider isVisible={sliderVisible} hideSlider={hideSlider} />

        <Filter tabTwoFlag={false} />

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
          <AllTypesDonut />

          <TypesIndicator />

          <TypesSquares />
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
  headerText: {
    fontWeight: 600,
    fontSize: 22,
    marginTop: 45,
    marginHorizontal: 20,
    marginBottom: 15,
  },
});
