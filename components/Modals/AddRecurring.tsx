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
import { ScrollView } from "react-native";
import { useColorScheme } from "@/components/useColorScheme";
import WhenPicker from "../Pickers/WhenPicker";
import CountPicker from "../Pickers/CountPicker";
import moment from "moment";
import PersonPicker from "../Pickers/PersonPicker";
// import { useTransactionImage } from "@/context/image";
// import ImagePickerCompo from "../Pickers/ImagePicker";

interface Category {
  name: string;
  hexColor: string;
  _id: any;
  type: string;
}

interface People {
  name: string;
  relation: string;
  contact: number;
  _id: string;
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

const AddRecurring = ({
  visible,
  handleCloseModal,
  slideModalAnim,
  clickedCategory,
}: {
  visible: boolean;
  handleCloseModal: () => void;
  slideModalAnim: any;
  clickedCategory: string;
}) => {
  const { fetchAnalytics } = useAnalytics();
  const { fetchUserDetails, categoriesList, peopleList, loadingUserDetails } = useUserData();
  const { addNewRecurringTransaction, loadingRecurring } =
    useRecurringTransactions();
  // const { deleteImage, uploadImage, imageUploading } = useTransactionImage();
  const filteredCategories = categoriesList.filter(
    (cat: Category) => cat.type === clickedCategory
  );

  const date = new Date();
  const hourIn12 = date.getHours() % 12 || 12; // Converts 0 to 12 for midnight

  const time = `${paddingZero(hourIn12)}:${paddingZero(date.getMinutes())} ${date.getHours() <= 12 ? "AM" : "PM"
    }`;

  const constWhen: When = {
    everyDay: time,
    everyWeek: "Monday",
    everyMonth: new Date().getDate(),
    everyYear: {
      month: new Date().getMonth(),
      date: new Date().getDate(),
    },
  };

  const colorScheme = useColorScheme();
  const inputBg = colorScheme === "dark" ? "#1C1C1C" : "#EDEDED";
  const textColor = colorScheme === "dark" ? "#FFF" : "#000";
  const placeholderColor = colorScheme === "dark" ? "#c2c2c2" : "#4d4d4d";

  const [count, setCount] = useState<number>(1);
  const [interval, setInterval] = useState<string>("Everyday");
  const [when, setWhen] = useState<When>(constWhen);
  const [amount, setAmount] = useState<number | undefined>();
  const [note, setNote] = useState<string>("");
  //   const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState<Category>(filteredCategories[0]);
  const [people, setPeople] = useState<People>(peopleList[0]);
  const [status, setStatus] = useState("In Progress");
  // const [imageURL, setImageURL] = useState(null);
  // const [localImage, setLocalImage] = useState(null);

  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const categoryName =
    clickedCategory === "Spent"
      ? "Expense"
      : clickedCategory === "Earned"
        ? "Earning"
        : clickedCategory === "Borrowed"
          ? "Loan"
          : "Lending";

  function closeTheModal() {
    handleCloseModal();

    resetAllValues();
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

  async function handleSave() {
    try {
      const flag = ValidateFields();
      if (!flag) return;

      // let updatedImage = imageURL;

      // if (localImage) {
      //   updatedImage = await uploadImage(localImage);
      //   setImageURL(updatedImage);
      // } else if (imageURL) {
      //   deleteImage(imageURL);
      //   setImageURL(null);
      // }

      const values = {
        recuring: {
          count,
          interval,
          when,
          pushedCount: 0,
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
        pushedIntoTransactions: false,
      };

      await addNewRecurringTransaction(values);
      await reFetchBoth();

      // Close modal
      closeTheModal();
    } catch (error) {
      // close
      closeTheModal();

      Alert.alert("Failed", "Failed to add your transaction");
    }
  }

  async function reFetchBoth() {
    await fetchAnalytics();
    await fetchUserDetails();
  }

  useEffect(() => {
    setCategory(filteredCategories[0]);
  }, [clickedCategory]);

  useEffect(() => {
    setShowError(false);
  }, [amount, note]);

  return (
    <ScrollView style={{ flex: 1 }}>
      <Modal visible={visible} transparent animationType="fade">
        <Pressable
          style={styles.modalContainer}
          onPress={closeTheModal}
          disabled={
            loadingRecurring
            // || imageUploading
          }
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
                  style={[styles.flex_row_btw, { marginBottom: 15 }]}
                >
                  <Text style={styles.title}>Add {categoryName} Recurring</Text>

                  {loadingRecurring ? (
                    // || imageUploading
                    <View style={styles.doneButton}>
                      <ActivityIndicator size="small" color={"#FFF"} />
                    </View>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={handleSave}
                      style={styles.doneButton}
                      disabled={loadingRecurring || loadingUserDetails}
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

                  {/* Count Picker */}
                  <CountPicker count={count} setCount={setCount} />

                  {/* Upload image */}
                  {/* <ImagePickerCompo
                    image={localImage}
                    setImage={setLocalImage}
                  /> */}
                </SafeAreaView>

                {/* {localImage && (
                  <SafeAreaView style={styles.imageContainer}>
                    <Image source={{ uri: localImage }} style={styles.image} />

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={handleDeleteImage}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeText}>Remove</Text>
                      <FontAwesome6 name="xmark" color={"#FFF"} size={16} />
                    </TouchableOpacity>
                  </SafeAreaView>
                )} */}

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

export default AddRecurring;

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
  image: {
    borderRadius: 5,
    width: "100%",
    height: 120,
    overflow: "hidden",
    objectFit: "cover",
    backgroundColor: "#e3e3e3",
  },
  imageContainer: {
    marginTop: 15,
    position: "relative",
  },
});
