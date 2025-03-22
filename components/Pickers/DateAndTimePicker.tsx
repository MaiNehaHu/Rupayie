import React, { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  Modal,
  Button,
  ScrollView,
  StyleSheet,
  Pressable,
  Animated,
} from "react-native";
import { Text, View } from "../Themed";
import { useColorScheme } from "@/components/useColorScheme";
import formatDateTimeSimple from "@/utils/formatDateTimeSimple";
import { Easing } from "react-native";
import { SafeAreaView } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { FlatList } from "react-native";

import moment from "moment";

const DateAndTimePicker = ({
  date,
  handleConfirm: setDate,
}: {
  date: Date;
  handleConfirm: any;
}) => {
  const colorScheme = useColorScheme();

  const [showPicker, setShowPicker] = useState(false);

  // States for manual selection
  const [selectedDay, setSelectedDay] = useState(date.getDate());
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth());
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());
  const [formatedDate, formatedTime] = formatDateTimeSimple(date).split(",");

  const slideModalAnim = useRef(new Animated.Value(200)).current; // Start position off-screen

  const inputBg = colorScheme === "dark" ? "#1C1C1C" : "#EDEDED";
  const textColor = colorScheme === "dark" ? "#FFF" : "#000";

  const openDateModal = () => {
    setShowPicker(true);

    setTimeout(() => {
      Animated.timing(slideModalAnim, {
        toValue: 0, // Slide up
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }, 100);
  };

  const handleCloseModal = () => {
    Animated.timing(slideModalAnim, {
      toValue: 700, // Move back down off-screen
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setShowPicker(false);
      setDate(date ? date : new Date());
    });
  };

  const handleConfirm = () => {
    Animated.timing(slideModalAnim, {
      toValue: 700, // Move back down off-screen
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      const newDate = new Date(selectedYear, selectedMonth, selectedDay);

      setDate(newDate);
      setShowPicker(false);
    });
  };

  return (
    <>
      <TouchableOpacity
        onPress={openDateModal}
        activeOpacity={0.7}
        style={[styles.smallBox, { backgroundColor: inputBg }]}
      >
        <Text>{formatedDate}</Text>
      </TouchableOpacity>

      {showPicker && (
        <Modal visible={showPicker} transparent animationType="fade" onRequestClose={handleCloseModal}>
          <Pressable style={styles.modalContainer} onPress={handleCloseModal}>
            <Pressable
              onPress={(e) => e.stopPropagation()}
              style={styles.modalContent}
            >
              <Animated.View
                style={[{ transform: [{ translateY: slideModalAnim }] }]}
              >
                <View style={styles.pickerContainer}>
                  <SafeAreaView
                    style={[styles.flex_row_btw, { marginBottom: 10 }]}
                  >
                    <Text style={styles.title}>Pick a Date</Text>

                    <TouchableOpacity onPress={handleCloseModal}>
                      <FontAwesome6 name="xmark" size={20} color={textColor} />
                    </TouchableOpacity>
                  </SafeAreaView>

                  {/* Pickers */}
                  <View style={styles.pickerRow}>
                    <SafeAreaView style={[styles.scrollPicker]}>
                      <CarouselPicker
                        data={Array.from({ length: 31 }, (_, i) => i + 1)} // Days of the month (1-31)
                        setSelectedDay={setSelectedDay}
                        selectedDay={selectedDay}
                      />
                    </SafeAreaView>

                    <SafeAreaView style={[styles.scrollPicker]}>
                      <CarouselPicker
                        data={Array.from({ length: 12 }, (_, i) => i)} // Months of the year (0-11)
                        setSelectedDay={setSelectedMonth}
                        selectedDay={selectedMonth}
                        monthPicker={true}
                      />
                    </SafeAreaView>

                    <SafeAreaView style={[styles.scrollPicker]}>
                      <CarouselPicker
                        data={Array.from(
                          { length: 50 },
                          (_, i) => new Date().getFullYear() - i
                        )} // Year range
                        setSelectedDay={setSelectedYear}
                        selectedDay={selectedYear}
                      />
                    </SafeAreaView>
                  </View>

                  <View style={[styles.doneButton]}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={handleConfirm}
                    >
                      <Text style={styles.doneText}>DONE</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </>
  );
};

export const CarouselPicker = ({
  data,
  setSelectedDay,
  selectedDay,
  monthPicker,
  weekPicker,
  ampmPicker,
}: {
  data: any;
  selectedDay: any;
  setSelectedDay: any;
  monthPicker?: boolean;
  weekPicker?: boolean;
  ampmPicker?: boolean;
}) => {
  const colorScheme = useColorScheme();
  const [currentIndex, setCurrentIndex] = useState(
    data.includes(selectedDay) ? data.indexOf(selectedDay) : 0
  );

  const textColor = colorScheme === "dark" ? "#FFF" : "#000";
  const flatListRef = useRef<any>(null);
  const height = 40;

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / height);
    setCurrentIndex(index);

    // Delay state update to prevent flickering issues
    setSelectedDay(data[index]);
  };

  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({
          index: currentIndex,
          animated: false,
        });
      }, 200);
    }
  }, []);

  const renderItem = ({ item }: any) => {
    const isActive = item === selectedDay;

    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: height,
        }}
      >
        <TouchableOpacity
          onPress={() => setSelectedDay(item)}
          disabled={ampmPicker && item == "" ? true : false}
        >
          <Text
            style={[
              isActive ? styles.selected : styles.pickerItem,
              {
                backgroundColor: isActive ? "#4588DF" : "transparent",
                color: isActive ? "#FFF" : textColor,
                paddingHorizontal: 10,
              },
            ]}
          >
            {monthPicker
              ? moment().month(item).format("MMMM")
              : weekPicker
              ? moment().day(item).format("dddd")
              : ampmPicker
              ? item
              : item.toString().padStart(2, "0")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      data={data}
      keyExtractor={(item: any) => item.toString()}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      snapToInterval={height}
      decelerationRate="fast"
      onScroll={handleScroll}
      scrollEventThrottle={16}
      initialScrollIndex={currentIndex}
      getItemLayout={(data, index) => ({
        length: height,
        offset: height * index,
        index,
      })}
      contentContainerStyle={{ alignItems: "center" }}
    />
  );
};

export default DateAndTimePicker;

const styles = StyleSheet.create({
  modalContent: {
    width: "100%",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: 15,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  smallBox: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  flex_row_btw: {
    gap: 5,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    width: "80%",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
  pickerContainer: {
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#666",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    // backgroundColor: "#4588DF", //blue
  },
  scrollPicker: {
    width: "30%",
    height: 200,
    borderRadius: 5,
    marginHorizontal: 5,
    paddingVertical: 10,
  },
  pickerItem: {
    fontSize: 14,
    padding: 5,
    marginVertical: 5,
    textAlign: "center",
  },
  selected: {
    fontSize: 16,
    padding: 5,
    width: "auto",
    fontWeight: "bold",
    marginVertical: 5,
    borderRadius: 10,
    textAlign: "center",
  },
  doneButton: {
    padding: 10,
    marginTop: 15,
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#4588DF", //blue
  },
  doneText: {
    fontWeight: 500,
    textAlign: "center",
    color: "#FFF",
  },
});
