import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { useProfile } from "@/context/profilePhoto";
import { useUserData } from "@/context/user";

export default function ProfilePhoto({ pressed }: { pressed: boolean }) {
  const { userDetails, loadingUserDetails } = useUserData();
  const { profilePhoto, setProfilePhoto } = useProfile();

  useEffect(() => {
    if (userDetails) setProfilePhoto(userDetails.userImage);
  }, [userDetails]);

  useEffect(() => {
    setProfilePhoto(userDetails?.userImage);
  }, [loadingUserDetails]);

  return profilePhoto ? (
    <Image
      source={profilePhoto}
      style={[
        styles.container,
        {
          opacity: pressed ? 0.7 : 1,
          borderColor: "#fff",
        },
      ]}
    />
  ) : (
    <View
      style={[
        styles.container,
        {
          opacity: pressed ? 0.7 : 1,
          borderColor: "#fff",
        },
      ]}
    >
      <Ionicons name="person" size={20} style={{ color: "#fff" }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    width: 30,
    height: 30,
    borderRadius: 30,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
