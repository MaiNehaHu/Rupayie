import { StyleSheet } from "react-native";
import React from "react";
import { Text, View } from "../Themed";
import { useUserData } from "@/context/user";

export default function Greeting() {
  const { userDetails, loadingUserDetails } = useUserData();

  const greeting = () => {
    const time = new Date();
    const h = time.getHours();

    return `${
      h < 12
        ? "Good Morning :)"
        : h >= 12 && h >= 15
        ? "Good Afternoon :)"
        : "Good Evening :)"
    }`;
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: 500, color: "white" }}>{greeting()}</Text>
      {!loadingUserDetails ? (
        <Text style={[styles.text, { color: "white" }]}>
          {userDetails?.name}
        </Text>
      ) : (
        <Text style={[styles.text, { color: "white" }]}>....</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 15,
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  text: {
    fontSize: 20,
    fontWeight: 600,
  },
});
