import {
  ActivityIndicator,
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import { SafeAreaView } from "react-native";
import { useUserData } from "@/context/user";
import { FontAwesome6 } from "@expo/vector-icons";
import { useTransactionsCategory } from "@/context/transCategory";
import DateAndTimePicker from "../Pickers/DateAndTimePicker";
import CategoryPicker from "../Pickers/CategoryPicker";
// import ImagePicker from "../Pickers/ImagePicker";
// import { Image } from "react-native";
// import { useTransactionImage } from "@/context/image";
import { useTransactions } from "@/context/transactions";
import { useCategory } from "@/context/categories";
import { useAnalytics } from "@/context/analytics";
import { Alert } from "react-native";
import PersonPicker from "../Pickers/PersonPicker";

interface Category {
  name: string;
  hexColor: string;
  _id: any;
  type: string;
}

interface Person {
  name: string;
  contact: Number;
  relation: string;
  _id: string;
}

const AddTransaction = ({
  isVisible,
  slideModalAnim,
  handleCloseModal,
}: {
  isVisible: boolean;
  slideModalAnim: any;
  handleCloseModal: any;
}) => {
  const colorScheme = useColorScheme();
  const { categoriesList, peopleList, fetchUserDetails } = useUserData();
  const { fetchAnalytics } = useAnalytics();
  const { loadingCategories } = useCategory();
  const { clickedTransCategory } = useTransactionsCategory();
  const { addNewTransaction, processing } = useTransactions();
  // const { deleteImage, uploadImage, imageUploading } = useTransactionImage();
  const filteredCategories = categoriesList.filter(
    (cat: Category) => cat.type === clickedTransCategory
  );

  const [amount, setAmount] = useState<number | undefined>();
  const [note, setNote] = useState<string>("");
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState<Category>(filteredCategories[0]);
  const [person, setPerson] = useState<Person>(peopleList[0]);
  const [status, setStatus] = useState("In Progress");
  // const [imageURL, setImageURL] = useState(null);
  // const [localImage, setLocalImage] = useState(null);

  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const categoryName =
    clickedTransCategory === "Spent"
      ? "Expense"
      : clickedTransCategory === "Earned"
      ? "Earning"
      : clickedTransCategory === "Borrowed"
      ? "Loan"
      : "Lending";

  const textColor = colorScheme === "dark" ? "#FFF" : "#000";
  const placeholderColor = colorScheme === "dark" ? "#c2c2c2" : "#4d4d4d";
  const inputBg = colorScheme === "dark" ? "#1C1C1C" : "#EDEDED";

  function closeModal() {
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
    setDate(new Date());

    // delete imageURL
    // setImageURL(null);
    // setLocalImage(null);

    // error text
    setShowError(false);
    setErrorText("");
  }

  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
  };

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
        amount,
        note,
        createdAt: date,
        category,
        status,
        // image: !updatedImage ? "" : updatedImage,
        ...(clickedTransCategory === "Borrowed" ||
        clickedTransCategory === "Lend"
          ? { people: person }
          : {}),
      };

      await addNewTransaction(values);
      await reFetchBoth();

      // Close modal
      closeModal();
    } catch (error) {
      // Close modal
      closeModal();

      Alert.alert("Failed", "Failed to add your transaction");
    }
  }

  async function reFetchBoth() {
    await fetchAnalytics();
    await fetchUserDetails();
  }

  useEffect(() => {
    setCategory(filteredCategories[0]);
  }, [clickedTransCategory, loadingCategories]);

  useEffect(() => {
    setShowError(false);
  }, [amount, note]);

  return (
    <ScrollView style={{ flex: 1, position: "absolute" }}>
      <Modal visible={isVisible} transparent animationType="fade">
        <Pressable
          style={styles.modalContainer}
          onPress={closeModal}
          disabled={processing}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={styles.modalContent}
          >
            <Animated.View
              style={[{ transform: [{ translateY: slideModalAnim }] }]}
            >
              <View style={styles.animatedView}>
                {/* Heading */}
                <SafeAreaView
                  style={[styles.flex_row_btw, { marginBottom: 15 }]}
                >
                  <Text style={styles.title}>Add Your {categoryName}</Text>

                  {processing ? (
                    <View style={styles.doneButton}>
                      <ActivityIndicator size="small" color={"#FFF"} />
                    </View>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={handleSave}
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

                {/* Date */}
                <DateAndTimePicker date={date} handleConfirm={handleConfirm} />

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
                  clickedTransCategory={clickedTransCategory}
                />

                {(clickedTransCategory === "Borrowed" ||
                  clickedTransCategory === "Lend") && (
                  <PersonPicker
                    person={person}
                    setPerson={setPerson}
                    peopleList={peopleList}
                  />
                )}

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

                  {/* Upload image */}
                  {/* <ImagePicker image={localImage} setImage={setLocalImage} /> */}
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

export default AddTransaction;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    paddingVertical: 25,
    justifyContent: "center",
    backgroundColor: "rgba(29, 29, 29, 0.4)",
  },
  modalContent: {
    width: "100%",
    paddingHorizontal: 15,
    alignItems: "center",
  },
  animatedView: {
    minWidth: "100%",
    padding: 20,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: "#777",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  smallBox: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  inputField: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 12,
    fontWeight: 400,
  },
  categoryCircle: {
    width: 15,
    height: 15,
    borderRadius: 20,
  },
  flex_row_btw: {
    gap: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
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
});
