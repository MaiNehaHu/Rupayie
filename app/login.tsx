import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Text, View } from "@/components/Themed";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { useColorScheme } from "@/components/useColorScheme";

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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ backgroundColor: bgColor, padding: 10, borderRadius: 10 }}
        onPress={handleLogin}
      >
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
