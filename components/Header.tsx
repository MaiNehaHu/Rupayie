import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Text, View } from "./Themed";
import { Link } from "expo-router";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import ProfilePhoto from "./Index/ProfilePhoto";

const Header = ({ showSlider }: { showSlider: any }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.5} onPress={() => showSlider()}>
        <FontAwesome
          name="bars"
          size={20}
          style={{
            color: "#fff",
          }}
        />
      </TouchableOpacity>

      <SafeAreaView style={styles.flex_row}>
        <Link href="/search" asChild>
          <FontAwesome6
            name="magnifying-glass-dollar"
            size={20}
            style={{
              color: "#fff",
            }}
          />
        </Link>
        <Link href="/notification" asChild>
          <FontAwesome
            name="bell"
            size={20}
            style={{
              color: "#fff",
            }}
          />
        </Link>
        <Link href="/profile" asChild>
          <Pressable>
            {({ pressed }) => <ProfilePhoto pressed={pressed} />}
          </Pressable>
        </Link>
      </SafeAreaView>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    margin: 15,
    marginTop: 45,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  flex_row: {
    gap: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
