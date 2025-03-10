import {
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Text, View } from "@/components/Themed";
import { TouchableOpacity } from "react-native";
import { useColorScheme } from "@/components/useColorScheme";
import { FontAwesome6 } from "@expo/vector-icons";

import categoryColors from "@/constants/categoryColors";
import { useCategory } from "@/context/categories";
import { useUserData } from "@/context/user";
import { useAnalytics } from "@/context/analytics";

interface Category {
  name: string;
  hexColor: string;
  _id: any;
  type: string;
  sign: string;
}

const ReadCategory = ({
  visible,
  handleCloseModal,
  slideModalAnim,
  category,
}: {
  visible: boolean;
  handleCloseModal: () => void;
  slideModalAnim: any;
  category: Category;
}) => {
  const { categoriesList, fetchUserDetails } = useUserData();
  const { fetchAnalytics } = useAnalytics();
  const {
    saveEditedCategory,
    deleteCategory,
    loadingCategories,
    loadingCategoryDelete,
  } = useCategory();
  const colorScheme = useColorScheme();
  const inputBg = colorScheme === "dark" ? "#1C1C1C" : "#EDEDED";
  const textColor = colorScheme === "dark" ? "#FFF" : "#000";
  const placeholderColor = colorScheme === "dark" ? "#c2c2c2" : "#4d4d4d";

  const [name, setName] = useState(category.name);
  const [hexColor, setHexColor] = useState(category.hexColor);
  const [type, setType] = useState(category.type);
  const [sign, setSign] = useState(category.sign);

  const [showError, setShowError] = useState(false);
  const [showAlreadyExists, setShowAlreadyExists] = useState(false);

  function validateValues() {
    if (name === "") {
      setShowError(true);
      return false;
    }

    const alreadyExists = categoriesList
      .filter((cat: Category) => cat._id !== category._id)
      .find((cat: Category) => cat.name === name || cat.hexColor === hexColor);

    if (alreadyExists) {
      setShowAlreadyExists(true);
      return false;
    }

    return true;
  }

  function noChangesDone() {
    if (name === category.name && hexColor === category.hexColor) return true;
    return false;
  }

  async function handleSave() {
    try {
      const flag = validateValues();
      if (!flag) return;

      const values = {
        name,
        hexColor,
        type,
        sign,
      };

      if (noChangesDone()) {
        // close directly
        closeTheModal();
      } else {
        //save
        await saveEditedCategory(category._id, values);
        // re fetch
        await reFetchBoth();
        // then close
        closeTheModal();
      }
    } catch (error) {
      closeTheModal();

      Alert.alert("Failed", "Failed to Save");
    }
  }

  function closeTheModal() {
    handleCloseModal();

    setTimeout(() => {
      resetAllValues();
    }, 3000);
  }

  function resetAllValues() {
    setName("");
    setHexColor(categoryColors[0]);
    setType(category.type);
    setSign("-");
  }

  async function reFetchBoth() {
    await fetchAnalytics();
    await fetchUserDetails();
  }

  async function handleDelete() {
    try {
      await deleteCategory(category._id);

      closeTheModal();
      await reFetchBoth();
    } catch (error) {
      closeTheModal();
      Alert.alert("Failed", "Failed to Delete");
    }
  }

  useEffect(() => {
    if (category.type === "Earned" || category.type === "Borrowed") {
      setSign("+");
    } else {
      setSign("-");
    }
  }, [type]);

  useEffect(() => {
    setShowError(false);
  }, [name]);

  useEffect(() => {
    setShowAlreadyExists(false);
  }, [hexColor, type, name]);

  useEffect(() => {
    setName(category.name);
    setHexColor(category.hexColor);
    setType(category.type);
    setSign(category.sign);
  }, [category]);

  return (
    <ScrollView style={{ flex: 1 }}>
      <Modal visible={visible} transparent animationType="fade">
        <Pressable
          style={styles.modalContainer}
          onPress={closeTheModal}
          disabled={loadingCategories || loadingCategoryDelete}
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
                  {loadingCategoryDelete ? (
                    <View
                      style={[styles.doneButton, { backgroundColor: "red" }]}
                    >
                      <ActivityIndicator size="small" color={"#FFF"} />
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={handleDelete}
                      activeOpacity={0.5}
                      disabled={loadingCategories || loadingCategoryDelete}
                      style={[styles.doneButton, { backgroundColor: "red" }]}
                    >
                      <FontAwesome6
                        name="trash"
                        color={"#FFF"}
                        style={styles.doneText}
                      />
                    </TouchableOpacity>
                  )}

                  <Text style={styles.title}>Edit {category.name}</Text>

                  {loadingCategories ? (
                    <View style={styles.doneButton}>
                      <ActivityIndicator size="small" color={"#FFF"} />
                    </View>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={handleSave}
                      disabled={loadingCategoryDelete || loadingCategories}
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

                <TextInput
                  style={[
                    styles.inputField,
                    { backgroundColor: inputBg, color: textColor },
                  ]}
                  placeholder="Category Name"
                  keyboardType="default"
                  placeholderTextColor={placeholderColor}
                  value={name}
                  onChangeText={(text) => setName(text)}
                />

                {showError && (
                  <Text
                    style={{
                      color: "red",
                      fontSize: 14,
                      textAlign: "left",
                      marginTop: -15,
                      marginLeft: 10,
                      marginBottom: 10,
                    }}
                  >
                    Enter name
                  </Text>
                )}

                {/* <SafeAreaView style={{ marginBottom: 20 }}>
                  <CategorySelector
                    category={type}
                    setClickedCategory={setType}
                  />
                </SafeAreaView> */}

                <SafeAreaView style={{ marginBottom: 20 }}>
                  <ColorPicker hexColor={hexColor} setHexColor={setHexColor} />
                </SafeAreaView>

                <SafeAreaView style={styles.flex_row_center}>
                  <View
                    style={[
                      styles.smallHexColor,
                      { backgroundColor: hexColor },
                    ]}
                  ></View>
                  <Text style={{ fontWeight: 500, textAlign: "center" }}>
                    {name == "" ? "Category Name" : name}
                  </Text>
                </SafeAreaView>

                {showAlreadyExists && (
                  <Text
                    style={{
                      color: "orange",
                      fontSize: 14,
                      textAlign: "center",
                      marginTop: 10,
                    }}
                  >
                    Category With These Values Already Exists
                  </Text>
                )}
              </View>
            </Animated.View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
};

const ColorPicker = ({
  hexColor,
  setHexColor,
}: {
  hexColor: string;
  setHexColor: (hexColor: string) => void;
}) => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "#FFF" : "#000";

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.colorsContainer}>
        {categoryColors.map((color) => (
          <TouchableOpacity
            key={color}
            activeOpacity={0.5}
            onPress={() => setHexColor(color)}
          >
            <View
              style={[
                styles.hexColor,
                {
                  backgroundColor: color,
                  borderColor: hexColor === color ? textColor : "transparent",
                },
              ]}
            ></View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default ReadCategory;

const styles = StyleSheet.create({
  modalContent: {
    width: "100%",
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
  flex_row: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  flex_row_center: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  inputField: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontWeight: 400,
    marginBottom: 20,
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
  hexColor: {
    height: 40,
    width: 40,
    borderRadius: 30,
    borderWidth: 3,
  },
  smallHexColor: {
    height: 15,
    width: 15,
    borderRadius: 30,
  },
  colorsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    marginTop: 10,
  },
});
