import {
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Text, View } from "../Themed";
import { useUserData } from "@/context/user";

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

const ProfilePicker = ({
  currentImage,
  setCurrentImage,
}: {
  currentImage: string;
  setCurrentImage: (value: string) => void;
}) => {
  const { savingUserProfile } = useUserData();

  return (
    <SafeAreaView style={{ marginBottom: 100 }}>
      <Text style={styles.title}>Pick Your Avatar</Text>

      <SafeAreaView style={styles.flex}>
        {[
          girl1,
          boy1,
          girl2,
          boy2,
          boy3,
          girl8,
          boy4,
          boy5,
          girl3,
          boy6,
          girl4,
          girl6,
          girl5,
          boy7,
          boy10,
          girl7,
        ].map((pf) => (
          <TouchableOpacity
            key={pf}
            activeOpacity={0.7}
            disabled={savingUserProfile || pf == currentImage}
            onPressIn={() => setCurrentImage(pf)}
          >
            <Image
              style={[
                styles.image,
                {
                  borderColor: pf == currentImage ? "#4588DF" : "transparent",
                  borderWidth: pf == currentImage ? 5 : 0,
                },
              ]}
              source={pf}
            />
          </TouchableOpacity>
        ))}
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default ProfilePicker;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 100,
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
});
