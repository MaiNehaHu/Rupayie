import {
  Easing,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useUserData } from "@/context/user";
import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import { CategorySelector } from "@/components/Two/SelectCategory";

import { Ionicons } from "@expo/vector-icons";
import AddCategory from "@/components/Modals/AddCategory";
import { Animated } from "react-native";
import ReadCategory from "@/components/Modals/ReadCategory";
import { useNavigation } from "expo-router";

interface Category {
  name: string;
  hexColor: string;
  _id: any;
  type: string;
  sign: string;
}

const Category = () => {
  const { categoriesList } = useUserData();
  const navigation = useNavigation();

  const colorScheme = useColorScheme();
  const categoryBg = colorScheme === "dark" ? "#1C1C1C" : "#EDEDED";
  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const oppColor = colorScheme === "light" ? "#fff" : "#000";
  const slideAddModalAnim = useRef(new Animated.Value(200)).current; // Start position off-screen
  const slideEditModalAnim = useRef(new Animated.Value(200)).current; // Start position off-screen

  const [catName, setCatName] = useState("Spent");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [clickedCategory, setClickedCategory] = useState<Category>(
    categoriesList[0]
  );

  function switchCategory(name: string) {
    setCatName(name);
  }

  const openAddCategoryModal = () => {
    setShowAddModal(true);

    setTimeout(() => {
      Animated.timing(slideAddModalAnim, {
        toValue: 0, // Slide up
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }, 100);
  };

  const handleCloseAddModal = () => {
    Animated.timing(slideAddModalAnim, {
      toValue: 700, // Move back down off-screen
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setShowAddModal(false);
    });
  };

  const openEditCategoryModal = () => {
    setShowEditModal(true);

    setTimeout(() => {
      Animated.timing(slideEditModalAnim, {
        toValue: 0, // Slide up
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }, 100);
  };

  const handleCloseEditModal = () => {
    Animated.timing(slideEditModalAnim, {
      toValue: 700, // Move back down off-screen
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setShowEditModal(false);
    });
  };

  function handleOpenEditCategory(category: Category) {
    setClickedCategory(category);
    openEditCategoryModal();
  }

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <TouchableOpacity onPress={openAddCategoryModal} activeOpacity={0.5}>
  //         <Ionicons name="add-circle" size={30} color={"#4FB92D"} />
  //       </TouchableOpacity>
  //     ),
  //   });
  // }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: categoryBg }]}>
      <View style={{ padding: 20, borderRadius: 20 }}>
        <CategorySelector
          setClickedCategory={switchCategory}
          clickedCategory={catName}
        />
      </View>

      <ScrollView style={{ marginTop: 10 }}>
        {categoriesList.length > 0 ? (
          categoriesList
            .filter((cat: Category) => cat.type === catName)
            .map((category: Category) => (
              <TouchableOpacity
                activeOpacity={0.8}
                key={category._id}
                onPress={() => handleOpenEditCategory(category)}
                style={[styles.categoryBox, { backgroundColor: oppColor }]}
              >
                <View
                  style={[
                    styles.categoryCircle,
                    { backgroundColor: category.hexColor },
                  ]}
                ></View>

                <Text style={styles.text} numberOfLines={1}>
                  {category?.name}
                </Text>
              </TouchableOpacity>
            ))
        ) : (
          <Text
            style={{
              marginTop: 20,
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            No Record
          </Text>
        )}
      </ScrollView>

      <SafeAreaView
        style={{ position: "absolute", bottom: 20, right: 20, zIndex: 10 }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={openAddCategoryModal}
          style={[styles.smallBox, { backgroundColor: "#4FB92D" }]}
        >
          <Ionicons name="add-circle" size={20} color={"#FFF"} />
          <Text style={[styles.addText, { color: "#FFF" }]}>Add Category</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {showAddModal && (
        <AddCategory
          visible={showAddModal}
          slideModalAnim={slideAddModalAnim}
          handleCloseModal={handleCloseAddModal}
          setCategory={() => {}}
          clickedCategory={catName}
        />
      )}

      {showEditModal && (
        <ReadCategory
          visible={showEditModal}
          category={clickedCategory}
          slideModalAnim={slideEditModalAnim}
          handleCloseModal={handleCloseEditModal}
        />
      )}
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    padding: 15,
    position: "relative",
  },
  addText: {
    fontWeight: 500,
    fontSize: 16,
    marginRight: 5,
  },
  categoryBox: {
    borderRadius: 30,
    padding: 12,
    gap: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  smallBox: {
    borderRadius: 30,
    padding: 7,
    gap: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    borderRadius: 30,
    padding: 5,
    gap: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
  },
  categoryCircle: {
    width: 20,
    height: 20,
    borderRadius: 30,
  },
});
