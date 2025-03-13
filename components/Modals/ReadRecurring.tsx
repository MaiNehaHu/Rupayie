import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Text, View } from "../Themed";
import { FontAwesome6 } from "@expo/vector-icons";
import { useUserData } from "@/context/user";
import CategoryPicker from "../Pickers/CategoryPicker";
import { useRecurringTransactions } from "@/context/recurringTransactions";
import { useAnalytics } from "@/context/analytics";
import { useColorScheme } from "@/components/useColorScheme";
import { ScrollView } from "react-native";
import WhenPicker from "../Pickers/WhenPicker";
import moment from "moment";
import CountPicker from "../Pickers/CountPicker";
import PersonPicker from "../Pickers/PersonPicker";

interface Recurring {
  amount: number;
  note: string;
  image: string | null;
  status: string;
  _id: any;
  createdAt: Date;
  people: {
    name: string;
    relation: string;
    contact: number;
    _id: string;
  };
  category: any;
  pushedIntoTransactions: boolean;
  recuring: any;
}

interface People {
  name: string;
  relation: string;
  contact: number;
  _id: string;
}

interface Category {
  name: string;
  hexColor: string;
  _id: any;
  type: string;
}

interface When {
  everyDay: string;
  everyWeek: string;
  everyMonth: number;
  everyYear: {
    month: number;
    date: number;
  };
}

function paddingZero(number: number) {
  return number.toString().padStart(2, "0");
}

const ReadRecurring = ({
  visible,
  handleCloseModal,
  slideModalAnim,
  clickedCategory,
  recurringTrans,
}: {
  visible: boolean;
  handleCloseModal: () => void;
  slideModalAnim: any;
  clickedCategory: string;
  recurringTrans: Recurring;
}) => {
  const { fetchAnalytics } = useAnalytics();
  const { fetchUserDetails, categoriesList, peopleList, loadingUserDetails } = useUserData();
  const {
    saveEditedRecurringTransaction,
    deleteRecurringTransaction,
    loadingRecurring,
    loadingRecurringDelete,
  } = useRecurringTransactions();
  const filteredCategories = categoriesList.filter(
    (cat: Category) => cat.type === clickedCategory
  );

  const date = new Date();
  const hourIn12 = date.getHours() % 12 || 12; // Converts 0 to 12 for midnight

  const time = `${paddingZero(hourIn12)}:${paddingZero(date.getMinutes())} ${date.getHours() <= 12 ? "AM" : "PM"
    }`;

  const constWhen: When = {
    everyDay: recurringTrans.recuring.when.everyDay
      ? recurringTrans.recuring.when.everyDay
      : time,
    everyWeek: recurringTrans.recuring.when.everyWeek
      ? recurringTrans.recuring.when.everyWeek
      : moment().day(),
    everyMonth: recurringTrans.recuring.when.everyMonth
      ? recurringTrans.recuring.when.everyMonth
      : new Date().getDate(),
    everyYear: {
      month: recurringTrans.recuring.when.everyYear?.month
        ? recurringTrans.recuring.when.everyYear?.month
        : new Date().getMonth(),
      date: recurringTrans.recuring.when.everyYear?.date
        ? recurringTrans.recuring.when.everyYear?.date
        : new Date().getDate(),
    },
  };

  const colorScheme = useColorScheme();
  const inputBg = colorScheme === "dark" ? "#1C1C1C" : "#EDEDED";
  const textColor = colorScheme === "dark" ? "#FFF" : "#000";
  const placeholderColor = colorScheme === "dark" ? "#c2c2c2" : "#4d4d4d";

  const [count, setCount] = useState<number>(recurringTrans.recuring.count);
  const [interval, setInterval] = useState<string>(
    recurringTrans.recuring.interval
  );
  const [when, setWhen] = useState<When>(constWhen);
  const [amount, setAmount] = useState<number | undefined>(
    recurringTrans.amount
  );
  const [note, setNote] = useState<string>(recurringTrans.note);
  //   const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState<Category>(recurringTrans.category);
  const [people, setPeople] = useState<People>(recurringTrans.people);
  const [status, setStatus] = useState(recurringTrans.status);

  // const [imageURL, setImageURL] = useState(recurringTrans.image);
  // const [localImage, setLocalImage] = useState(recurringTrans.image);

  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState("");

  function closeTheModal() {
    handleCloseModal();

    setTimeout(() => {
      resetAllValues();
    }, 3000);
  }

  function resetAllValues() {
    setAmount(undefined);
    setNote("");
    setCategory(filteredCategories[0]);
    setStatus("In Progress");

    // delete imageURL
    // setImageURL(null);
    // setLocalImage(null);

    // error text
    setShowError(false);
    setErrorText("");
  }

  async function handleDelete() {
    try {
      await deleteRecurringTransaction(recurringTrans._id);

      closeTheModal();
      await reFetchBoth();
    } catch (error) {
      closeTheModal();
      Alert.alert("Failed", "Failed to Delete");
    }
  }

  // function handleDeleteImage() {
  //   setLocalImage(null);
  // }

  function ValidateFields() {
    if (!amount) {
      setShowError(true);
      setErrorText("Enter Amount");
      return false;
    }

    return true;
  }

  function noChangesDone() {
    if (
      note === recurringTrans.note &&
      amount === recurringTrans.amount &&
      status === recurringTrans.status &&
      count === recurringTrans.recuring.count &&
      interval === recurringTrans.recuring.interval &&
      JSON.stringify(people) === JSON.stringify(recurringTrans.people) &&
      JSON.stringify(category) == JSON.stringify(recurringTrans.category) &&
      JSON.stringify(when) === JSON.stringify(recurringTrans.recuring.when)
      // && imageURL === recurringTrans.image
    )
      return true;
    return false;
  }

  async function handleSave() {
    try {
      const flag = ValidateFields();
      if (!flag) return;

      const values = {
        recuring: {
          count,
          interval,
          when,
          pushedCount: recurringTrans.recuring.pushedCount,
        },
        amount,
        note,
        createdAt: new Date(),
        category,
        status,
        // image: !updatedImage ? "" : updatedImage,
        ...(clickedCategory === "Borrowed" || clickedCategory === "Lend"
          ? { people }
          : {}),
      };

      if (noChangesDone()) {
        closeTheModal();
        return;
      }

      // Save transaction and refresh
      await saveEditedRecurringTransaction(recurringTrans._id, values);
      await reFetchBoth();

      closeTheModal();
    } catch (error) {
      closeTheModal();

      Alert.alert("Failed", "Failed to Save");
    }
  }

  async function reFetchBoth() {
    await fetchAnalytics();
    await fetchUserDetails();
  }

  useEffect(() => {
    setShowError(false);
  }, [amount, note]);

  useEffect(() => {
    setAmount(recurringTrans.amount);
    setNote(recurringTrans.note);
    setStatus(recurringTrans.status);
    setCategory(recurringTrans.category);

    setPeople(recurringTrans.people);
  }, [recurringTrans]);

  return (
    <ScrollView style={{ flex: 1 }}>
      <Modal visible={visible} transparent animationType="fade">
        <Pressable
          style={styles.modalContainer}
          onPress={closeTheModal}
          disabled={loadingRecurring || loadingRecurringDelete || loadingUserDetails}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={styles.modalContent}
          >
            <Animated.View
              style={[{ transform: [{ translateY: slideModalAnim }] }]}
            >
              <View style={styles.animatedView}>
                <SafeAreaView
                  style={[styles.flex_row_start_btw, { marginBottom: 15 }]}
                >
                  {loadingRecurringDelete || loadingUserDetails ? (
                    <View
                      style={[styles.doneButton, { backgroundColor: "red" }]}
                    >
                      <ActivityIndicator size="small" color={"#FFF"} />
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={handleDelete}
                      activeOpacity={0.5}
                      disabled={loadingRecurring || loadingRecurringDelete || loadingUserDetails}
                      style={[styles.doneButton, { backgroundColor: "red" }]}
                    >
                      <FontAwesome6
                        name="trash"
                        color={"#FFF"}
                        style={styles.doneText}
                      />
                    </TouchableOpacity>
                  )}

                  <Text style={styles.title}>Edit Transaction</Text>

                  {loadingRecurring ? (
                    <View style={styles.doneButton}>
                      <ActivityIndicator size="small" color={"#FFF"} />
                    </View>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={handleSave}
                      disabled={loadingRecurring || loadingRecurringDelete || loadingUserDetails}
                      style={styles.doneButton}
                    >
                      <FontAwesome6
                        name="save"
                        color={"#FFF"}
                        style={styles.doneText}
                      />
                    </TouchableOpacity>
                  )}
                </SafeAreaView>

                {/* Amount */}
                <TextInput
                  style={[
                    styles.inputField,
                    { backgroundColor: inputBg, color: textColor },
                  ]}
                  placeholder="Amount"
                  keyboardType="numeric"
                  placeholderTextColor={placeholderColor}
                  value={amount !== undefined ? amount.toString() : ""}
                  onChangeText={(text) => {
                    const numericValue =
                      parseInt(text.replace(/[^0-9]/g, ""), 10) || 0;
                    setAmount(numericValue);
                  }}
                />

                {/* Category */}
                <CategoryPicker
                  category={category}
                  setCategory={setCategory}
                  filteredCategories={filteredCategories}
                  clickedTransCategory={clickedCategory}
                />

                {(clickedCategory === "Borrowed" ||
                  clickedCategory === "Lend") && (
                    <>
                      <PersonPicker
                        person={people}
                        setPerson={setPeople}
                        peopleList={peopleList}
                      />

                      {/* Status */}
                      {/* <SafeAreaView>
                      <StatusBar textColor={textColor} />
                    </SafeAreaView> */}
                    </>
                  )}

                {/* Recurrin when */}
                <WhenPicker
                  interval={interval}
                  setInterval={setInterval}
                  when={when}
                  setWhen={setWhen}
                  constWhen={constWhen}
                />

                {/* Note */}
                <SafeAreaView style={styles.flex_row_center_btw}>
                  <TextInput
                    style={[
                      styles.inputField,
                      {
                        flex: 1,
                        backgroundColor: inputBg,
                        color: textColor,
                        marginBottom: 0,
                      },
                    ]}
                    numberOfLines={1}
                    keyboardType="default"
                    placeholder="Note (Optional)"
                    placeholderTextColor={placeholderColor}
                    value={note}
                    onChangeText={(text) => setNote(text)}
                  />

                  <CountPicker count={count} setCount={setCount} />
                </SafeAreaView>

                <SafeAreaView>
                  {showError && (
                    <Text
                      style={{
                        color: "red",
                        fontSize: 14,
                        textAlign: "center",
                        marginTop: 15,
                      }}
                    >
                      {errorText}
                    </Text>
                  )}
                </SafeAreaView>
              </View>
            </Animated.View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
};

export default ReadRecurring;

const styles = StyleSheet.create({
  modalContent: {
    width: "100%",
    // marginBottom: 100,
  },
  modalContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: 15,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  animatedView: {
    padding: 20,
    borderRadius: 15,
    overflowY: "scroll",
    borderWidth: 0.5,
    borderColor: "#666",
  },
  inputField: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 12,
    fontWeight: 400,
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
  flex_row_start_btw: {
    gap: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  doneButton: {
    borderRadius: 30,
    backgroundColor: "#4FB92D",
    alignSelf: "flex-end",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 40,
    marginTop: -5,
    // marginBottom: 15,
  },
  doneText: {
    fontSize: 20,
    fontWeight: 500,
  },
  removeButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    gap: 7,
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#666666",
  },
  removeText: {
    fontWeight: 500,
    color: "#fff",
  },
  flex_row_center_btw: {
    gap: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
