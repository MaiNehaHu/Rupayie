import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { Text, View } from "./Themed";
import { Link } from "expo-router";
import { FontAwesome, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useUserData } from "@/context/user";
import { useProfile } from "@/context/profilePhoto";

const Header = ({ showSlider }: { showSlider: any }) => {
  const { userDetails, loadingUserDetails } = useUserData();
  const { profilePhoto, setProfilePhoto } = useProfile();

  useEffect(() => {
    if (userDetails) setProfilePhoto(userDetails.userImage);
  }, [userDetails, loadingUserDetails]);

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
          <Pressable
            style={[
              styles.imageContainer,
              {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            {({ pressed }) => (
              <>
                {profilePhoto ? (
                  <Image
                    source={profilePhoto}
                    style={[
                      styles.imageContainer,
                      {
                        opacity: pressed ? 0.7 : 1,
                        borderColor: "#fff",
                      },
                    ]}
                  />
                ) : (
                  <SafeAreaView
                    style={[
                      styles.imageContainer,
                      {
                        opacity: pressed ? 0.7 : 1,
                        borderColor: "#fff",
                      },
                    ]}
                  >
                    <Ionicons
                      name="person"
                      size={18}
                      style={{ color: "#fff" }}
                    />
                  </SafeAreaView>
                )}
              </>
            )}
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
