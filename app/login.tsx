import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Text, View } from "@/components/Themed";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { useColorScheme } from "@/components/useColorScheme";
import { StatusBar } from "expo-status-bar";
const Logo = require("@/assets/pages/loginLogo.png");

type RootStackParamList = {
  "(tabs)": undefined;
};

const Login = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const oppColor = colorScheme === "light" ? "#fff" : "#000";
  const placeholderColor = colorScheme === "dark" ? "#c2c2c2" : "#4d4d4d";
  const bgColor = colorScheme === "dark" ? "#1C1C1C" : "#EDEDED";

  function handleLogin() {
    navigation.navigate("(tabs)");
  }

  const screenWidth = Dimensions.get("window").width;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: bgColor }}>
      <StatusBar backgroundColor={"transparent"} />
      <SafeAreaView style={styles.container}>
        <Image
          source={Logo}
          style={{
            width: screenWidth,
            minHeight: "40%",
            maxHeight: "45%",
            objectFit: "cover",
          }}
        />

        <SafeAreaView
          style={{
            padding: 25,
            minHeight: "55%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Text style={styles.header}>Welcome!</Text>
          <Text style={{ fontSize: 16 }}>
            Take control of your finances—track, plan, and grow. Your money,
            your rules.
          </Text>

          <SafeAreaView style={[styles.flex_row_btw, { marginTop: "15%" }]}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: textColor }]}
              onPress={handleLogin}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, { color: oppColor }]}>
                LogIn
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogin}
              style={[
                styles.button,
                {
                  backgroundColor: bgColor,
                  borderColor: textColor,
                  borderWidth: 2,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, { color: textColor }]}>
                SignUp
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: "100%",
    display: "flex",
    // alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 24,
    fontWeight: 500,
    textAlign: "left",
    marginBottom: 10,
  },
  flex_row_btw: {
    gap: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    width: "48%",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 500,
    textAlign: "center",
  },
});
