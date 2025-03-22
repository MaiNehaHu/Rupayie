import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Text, View } from "./Themed";
import { Link } from "expo-router";
import { FontAwesome, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useUserData } from "@/context/user";
import { useProfile } from "@/context/profilePhoto";
import { getStatusBarHeight } from "react-native-status-bar-height";

const girl1 = require("@/assets/profile/g1.png");
const girl2 = require("@/assets/profile/g2.png");
const girl3 = require("@/assets/profile/g3.png");
const girl4 = require("@/assets/profile/g4.png");
const girl5 = require("@/assets/profile/g5.png");
const girl6 = require("@/assets/profile/g6.png");
const girl7 = require("@/assets/profile/g7.png");
const girl8 = require("@/assets/profile/g8.png");
const boy1 = require("@/assets/profile/b1.png");
const boy2 = require("@/assets/profile/b2.png");
const boy3 = require("@/assets/profile/b3.png");
const boy4 = require("@/assets/profile/b4.png");
const boy5 = require("@/assets/profile/b5.png");
const boy6 = require("@/assets/profile/b6.png");
const boy7 = require("@/assets/profile/b7.png");
const boy10 = require("@/assets/profile/b10.png");

const Header = ({ showSlider }: { showSlider: any }) => {
  const { userDetails, loadingUserDetails } = useUserData();
  const { profilePhoto, setProfilePhoto } = useProfile();

  useEffect(() => {
    const matchedImage = [girl1, girl2, girl3, girl4, girl5, girl6, girl7, girl8, boy1, boy2, boy3, boy4, boy5, boy6, boy7, boy10]
      .find((img) => img == userDetails?.userImage);

    if (userDetails) setProfilePhoto(matchedImage);
  }, [userDetails, loadingUserDetails]);

  const statusBarHeight = Platform.OS === "ios" ? getStatusBarHeight() : StatusBar.currentHeight || 36;

  return (
    <View style={[styles.container, { marginTop: statusBarHeight }]}>
      <TouchableOpacity activeOpacity={0.5} onPress={() => showSlider()}>
        <FontAwesome
          name="bars"
          size={22}
          style={{
            color: "#fff",
            padding: 10
          }}
        />
      </TouchableOpacity>

      <SafeAreaView style={styles.flex_row}>
        <Link href="/search" asChild>
          <FontAwesome6
            name="magnifying-glass-dollar"
            size={22}
            style={{
              color: "#fff",
              padding: 10
            }}
          />
        </Link>
        <Link href="/notification" asChild>
          <FontAwesome
            name="bell"
            size={22}
            style={{
              color: "#fff",
              padding: 10
            }}
          />
        </Link>
        <Link href="/profile" asChild>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.imageContainer,
              {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <>
              {!loadingUserDetails && profilePhoto ? (
                <Image
                  source={profilePhoto}
                  style={[
                    styles.imageContainer,
                    {
                      borderColor: "#fff",
                      marginHorizontal: 10
                    },
                  ]}
                />
              ) : (
                (loadingUserDetails || !profilePhoto) && (
                  <SafeAreaView
                    style={[
                      styles.imageContainer,
                      {
                        borderColor: "#fff",
                        marginHorizontal: 10
                      },
                    ]}
                  >
                    <Ionicons
                      name="person"
                      size={18}
                      style={{ color: "#fff" }}
                    />
                  </SafeAreaView>
                )
              )}
            </>
          </TouchableOpacity>
        </Link>
      </SafeAreaView>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
    marginBottom: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  flex_row: {
    gap: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderRadius: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
