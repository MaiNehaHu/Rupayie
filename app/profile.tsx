import {
  Image,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Text, View } from "@/components/Themed";
import ProfilePicker from "@/components/Pickers/ProfilePicker";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/components/useColorScheme";
import { useProfile } from "@/context/profilePhoto";
import { useUserData } from "@/context/user";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { useLogin } from "@/context/login";
import { useAnalytics } from "@/context/analytics";

type RootStackParamList = {
  login: undefined;
};

const profile = () => {
  const {
    userDetails,
    updateUserDetails,
    fetchUserDetails,
    savingUserName,
    savingUserProfile,
  } = useUserData();
  const { setProfilePhoto } = useProfile();
  const { setLoggedIn, setLoggedUserId } = useLogin();
  const { setUserDetailsDetails } = useUserData();
  const { setAnalytics } = useAnalytics()
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const oppColor = colorScheme === "light" ? "#fff" : "#000";
  const placeholderColor = colorScheme === "dark" ? "#c2c2c2" : "#4d4d4d";
  const bgColor = colorScheme === "dark" ? "#1C1C1C" : "#EDEDED";

  const [showProfilePicker, setShowProfilePicker] = useState(false);
  const [showUserNameSaveBtn, setShowUserNameSaveBtn] = useState(false);
  const [userName, setUserName] = useState(userDetails?.name);
  const [userProfile, setUserProfile] = useState(userDetails?.userImage);

  function handlePenClick() {
    setShowProfilePicker(!showProfilePicker);
  }

  async function handleSaveName() {
    await updateUserDetails({ ...userDetails, name: userName }, "name");
    await fetchUserDetails();
    setShowUserNameSaveBtn(false);
  }

  async function handleSaveProfile() {
    if (userProfile === userDetails?.userImage) {
      setShowProfilePicker(false);
      return;
    }

    setProfilePhoto(userProfile);
    setShowProfilePicker(false);

    await updateUserDetails(
      { ...userDetails, userImage: userProfile },
      "profile"
    );
    await fetchUserDetails();
  }

  async function handleLogout() {
    setLoggedIn(false);
    setLoggedUserId("");

    // Clear User Data
    setUserDetailsDetails(null);
    setAnalytics({
      totalSpent: 0,
      totalEarned: 0,
      totalAmount: 0,
    });

    navigation.replace("login");
  }

  useEffect(() => {
    setUserName(userDetails?.name);
    setUserProfile(userDetails?.userImage);
  }, [userDetails]);

  useEffect(() => {
    setShowUserNameSaveBtn(userName === userDetails?.name ? false : true);
  }, [userName]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={[
            styles.flex_row,
            styles.logoutButton,
            { backgroundColor: textColor },
          ]}
          activeOpacity={0.7}
          onPress={handleLogout}
        >
          <Text style={{ color: oppColor }} >Logout</Text>

          <FontAwesome6
            size={16}
            color={oppColor}
            name="arrow-right-from-bracket"
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <SafeAreaView style={[styles.center, { marginVertical: 20 }]}>
          <SafeAreaView style={{ width: 200, height: 200 }}>
            {userProfile ? (
              <Image
                source={userProfile}
                style={[styles.image, { borderColor: textColor }]}
              />
            ) : (
              <View
                style={[
                  styles.image,
                  styles.center,
                  { borderColor: textColor },
                ]}
              >
                <Ionicons
                  name="person"
                  size={100}
                  style={{ color: textColor }}
                />
              </View>
            )}

            {/* Edit Button */}
            <TouchableOpacity
              onPress={!showProfilePicker ? handlePenClick : handleSaveProfile}
              activeOpacity={0.7}
              disabled={savingUserProfile}
              style={[
                styles.pen,
                { backgroundColor: !showProfilePicker ? textColor : "#4FB92D" },
              ]}
            >
              {!savingUserProfile ? (
                <FontAwesome6
                  name={!showProfilePicker ? "pen" : "check"}
                  size={20}
                  color={oppColor}
                />
              ) : (
                <ActivityIndicator size="small" color={oppColor} />
              )}
            </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaView>

        <SafeAreaView style={[styles.flex_row, { alignSelf: "center" }]}>
          <View style={[styles.inputField, { backgroundColor: oppColor }]}>
            <TextInput
              style={{ color: textColor, fontWeight: 600 }}
              placeholder="Your Name"
              value={userName}
              onChangeText={(text) => setUserName(text)}
              placeholderTextColor={placeholderColor}
            />
          </View>

          {showUserNameSaveBtn && userName?.trim("") !== "" && (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={handleSaveName}
              disabled={savingUserName}
              style={[
                styles.doneButton,
                { marginLeft: 5, alignSelf: "center" },
              ]}
            >
              {!savingUserName ? (
                <FontAwesome6
                  name={"check"}
                  size={20}
                  color={"#FFF"}
                  style={styles.doneText}
                />
              ) : (
                <ActivityIndicator size="small" color={"#FFF"} />
              )}
            </TouchableOpacity>
          )}
        </SafeAreaView>

        {showProfilePicker && (
          <SafeAreaView style={{ padding: 30 }}>
            <ProfilePicker
              currentImage={userProfile}
              setCurrentImage={setUserProfile}
            />
          </SafeAreaView>
        )}
      </View>
    </ScrollView>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: "100%",
    padding: 15,
  },
  center: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  flex_row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  pen: {
    position: "absolute",
    right: 0,
    top: 0,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  inputField: {
    width: "auto",
    minWidth: 50,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderRadius: 100,
  },
  doneButton: {
    height: 40,
    width: 40,
    borderRadius: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4FB92D",
    // marginBottom: 15,
  },
  doneText: {
    fontSize: 20,
    fontWeight: 500,
  },
  logoutButton: {
    gap: 10,
    alignItems: "center",
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
});
