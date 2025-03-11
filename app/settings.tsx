import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useColorScheme } from "@/components/useColorScheme";
import ToggleSwitch from "@/components/ToggleSwitch";
import { useUserData } from "@/context/user";
import { useTrash } from "@/context/trash";
import { Text, View } from "@/components/Themed";

const settings = () => {
  const colorScheme = useColorScheme();
  const bgColor = colorScheme === "dark" ? "#1C1C1C" : "#EDEDED";
  const oppBgColor = colorScheme === "dark" ? "#000" : "#FFF";
  const { trashTransactions, fetchUserDetails, autoCleanTrash } = useUserData();
  const { emptyTrash, isTrashCleaning, autoCleanTrashAfterWeek } = useTrash();

  const [toggleDeleteOlderthan7days, setToggleDeleteOlderthan7days] =
    useState(autoCleanTrash);

  async function handleSwitchAutoDeleteOlderThanWeek(flag: boolean) {
    setToggleDeleteOlderthan7days(flag);
    await autoCleanTrashAfterWeek(flag);
    await fetchUserDetails();
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: bgColor }}>
      <SafeAreaView
        style={[{ backgroundColor: oppBgColor, padding: 15, marginBottom: 15 }]}
      >
        <Text style={styles.title}>Trash</Text>
        <View style={[styles.flex_row_btw, { flex: 1 }]}>
          <Text style={{ width: "85%" }}>
            Automatically delete the trash transactions that have been in Trash
            for more tha 7 days
          </Text>
          <ToggleSwitch
            isOn={toggleDeleteOlderthan7days}
            setIsOn={handleSwitchAutoDeleteOlderThanWeek}
          />
        </View>
      </SafeAreaView>
      {/* <SafeAreaView
        style={[
          styles.flex_row_btw,
          { backgroundColor: oppBgColor, padding: 15, marginBottom: 15 },
        ]}
      >
        <Text style={{ width: "85%" }}>
          Automatically delete the trash transactions that have been in Trash
          for more tha 7 days
        </Text>
        <ToggleSwitch
          isOn={toggleDeleteOlderthan7days}
          setIsOn={handleSwitchAutoDeleteOlderThanWeek}
        />
      </SafeAreaView> */}
    </ScrollView>
  );
};

export default settings;

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 5,
    color: "#4588DF",
  },
  flex_row_btw: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
