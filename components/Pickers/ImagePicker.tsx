import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useColorScheme } from "@/components/useColorScheme";
import { FontAwesome6 } from "@expo/vector-icons";
import { useTransactionImage } from "@/context/image";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTransactions } from "@/context/transactions";

// Google Drive,
// Microsoft Drive

const ImagePickerCompo = ({
  image,
  setImage,
}: {
  image: any;
  setImage: any;
}) => {
  const colorScheme = useColorScheme();
  const { processingDelete, processing } = useTransactions();
  const { imageUploading } = useTransactionImage();
  const textColor = colorScheme === "dark" ? "#FFF" : "#000";

  async function handleImageUploading() {
    try {
      const imageExists = !!image;

      if (imageExists) {
        const confirmed = await new Promise((resolve) =>
          Alert.alert(
            "Replace Image",
            "Do you want to replace the current image?",
            [
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => resolve(false),
              },
              { text: "Replace", onPress: () => resolve(true) },
            ]
          )
        );

        if (!confirmed) return;
      }

      // Request media library permissions if not already granted
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Permission to access media library is required!"
        );
        return;
      }

      // Pick an image from the gallery
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (result.canceled) return;

      const uri = result.assets[0].uri;
      setImage(uri);
    } catch (error) {
      Alert.alert("Error", "Error Uploading Image");
    }
  }

  return (
    <>
      <TouchableOpacity
        onPress={handleImageUploading}
        disabled={imageUploading || processingDelete || processing}
        activeOpacity={0.5}
      >
        {!imageUploading ? (
          <FontAwesome6
            name="camera-retro"
            size={20}
            style={{ color: textColor, paddingHorizontal: 5 }}
          />
        ) : (
          <ActivityIndicator
            color={textColor}
            size={20}
            style={{ paddingHorizontal: 5 }}
          />
        )}
      </TouchableOpacity>
    </>
  );
};

export default ImagePickerCompo;

const styles = StyleSheet.create({});
