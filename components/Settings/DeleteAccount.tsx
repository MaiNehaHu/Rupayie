import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Text } from '../Themed'
import { useUserData } from '@/context/user'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from 'expo-router'
import { useMessages } from '@/context/messages'
import { useLogin } from '@/context/login'

const DeleteAccount = () => {
    const navigation = useNavigation();
    const { deletAccount, deletingUser, setUserDetails } = useUserData();
    const { setLoggedIn, setLoggedUserId } = useLogin();

    async function handleAccountDelete() {
        try {
            await deletAccount();
            setLoggedIn(false);
            setLoggedUserId("");
            setUserDetails([]);

            await AsyncStorage.clear();

            navigation.goBack();
        } catch (error) {
            // Alert.alert("Failed to Delete");
            Alert.prompt("Failed to Delete");
        }
    }

    async function handleDeletePress() {
        Alert.alert(
            "Deleting a account is irreversible",
            "This will remove the account and all associated data.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Yes, Delete.",
                    onPress: () => handleAccountDelete(),
                    style: "destructive",
                },
            ]
        );
    }

    return (
        <SafeAreaView>
            <TouchableOpacity onPress={handleDeletePress} disabled={deletingUser} activeOpacity={0.7} style={styles.button}>
                <Text style={{ fontWeight: 500, color: "#fff", textAlign: "center" }}>
                    {!deletingUser ?
                        "Delete My Account" :
                        "Deleting..."
                    }
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default DeleteAccount

const styles = StyleSheet.create({
    button: {
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 7,
        backgroundColor: "#f22929",
    },
})