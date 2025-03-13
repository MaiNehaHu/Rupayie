import React, { useState, useEffect, useRef } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useColorScheme } from "@/components/useColorScheme";
import { Text, View } from "./Themed";
import { Ionicons } from "@expo/vector-icons";
import { useTransactionFilter } from "@/context/filterTransByDate";
import { useUserData } from "@/context/user";

interface Option {
  title: string;
  from: Date;
  to: Date;
}

const getMonthRange = (monthsAgo: number) => {
  const now = new Date();

  // Start Date (first day of target month)
  const start = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);

  // End Date (last day of target month)
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

  return { from: start, to: end };
};

const Filter = ({ tabTwoFlag }: { tabTwoFlag: boolean }) => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "#FFF" : "#000";

  const { loadingUserDetails } = useUserData();
  const { setTransactionsFilter, setDonutTransactionsFilter } =
    useTransactionFilter();

  const buttonsName: Option[] = [
    { title: "All Time", from: new Date(1999, 11, 31), to: new Date() },
    { title: "This Month", ...getMonthRange(0) },
    { title: "Last Month", ...getMonthRange(1) },
    { title: "Last 3 Months", from: getMonthRange(2).from, to: getMonthRange(0).to },
    { title: "Last 6 Months", from: getMonthRange(5).from, to: getMonthRange(0).to },
  ];

  const [selectedOption, setSelectedOption] = useState<Option>(buttonsName[0]);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (tabTwoFlag) {
      setTransactionsFilter(buttonsName[0]);
    } else {
      setDonutTransactionsFilter(buttonsName[0]);
    }
  }, [loadingUserDetails]);

  function handleOptionSelect(btn: Option, index: number) {
    setSelectedOption(btn);
    if (tabTwoFlag) {
      setTransactionsFilter(btn);
    } else {
      setDonutTransactionsFilter(btn);
    }

    // Scroll to selected index
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0, // Align to left
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Ionicons
        name="calendar"
        size={24}
        color={textColor}
        style={{ marginRight: 10 }}
      />
      <FlatList
        ref={flatListRef}
        horizontal
        data={buttonsName}
        keyExtractor={(item) => item.title}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.optionButton,
              {
                borderBottomWidth: 2.5,
                borderBottomColor:
                  item.title === selectedOption.title ? "#4FB92D" : "transparent",
              },
            ]}
            onPress={() => handleOptionSelect(item, index)}
          >
            <Text
              style={{
                color:
                  item.title === selectedOption.title ? "#4FB92D" : textColor,
              }}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={0} // Ensures "All Time" is visible at start
        getItemLayout={(data, index) => ({
          length: 90, // Approximate width of each item
          offset: 90 * index,
          index,
        })}
      />
    </SafeAreaView>
  );
};

export default Filter;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  optionButton: {
    paddingRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },
});
