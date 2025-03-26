import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Text } from './Themed';
import { useColorScheme } from "@/components/useColorScheme";
import { Ionicons } from '@expo/vector-icons';
import { useAnalytics } from '@/context/analytics';
import { useUserData } from '@/context/user';
import { useMessages } from '@/context/messages';
import MessagePopUp from './MessagePopUp';

const NoInternet = () => {
    const { failedFetching, fetchAnalytics } = useAnalytics();
    const { fetchUserDetails } = useUserData();
    const { error, setError, messageText, setMessageText } = useMessages()

    const [refresh, setRefresh] = useState(false);

    const colorScheme = useColorScheme();
    const bgColor = colorScheme === "dark" ? "#121212" : "#EDEDED";
    const textColor = colorScheme === "dark" ? "#fff" : "#000";
    const btnBgColor = colorScheme === "dark" ? "#000" : "#fff";

    async function refreshPage() {
        setRefresh(true);

        try {
            console.log("Fetching on Reload");

            await fetchAnalytics();
            await fetchUserDetails();
            setMessageText("Welcome Back!")
        } catch (error) {
            console.error("Error Refreshing: ", error);
            setError("Something Went Wrong!")
        } finally {
            setRefresh(false);
        }
    }

    return failedFetching && (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refresh}
                    onRefresh={() => refreshPage()}
                    colors={["#000"]}
                />
            }
            style={{ flex: 1, backgroundColor: bgColor, padding: 20 }}
        >
            <SafeAreaView style={[{ minHeight: "100%" }, styles.center]}>
                <Ionicons name="cloud-offline" size={50} color={textColor} />
                <Text style={styles.boldText}>
                    Something Went Wrong!
                </Text>
                <Text style={styles.lightText}>
                    Please wait for a while and then come back.
                </Text>

                <TouchableOpacity
                    onPress={refreshPage}
                    activeOpacity={0.5}
                    style={[styles.btn, { backgroundColor: btnBgColor }]}
                >
                    <Text style={{ textAlign: "center", fontWeight: 500 }}>Refresh Now</Text>
                </TouchableOpacity>

                <MessagePopUp
                    error={error}
                    messageText={messageText}
                    setError={setError}
                    setMessageText={setMessageText}
                />
            </SafeAreaView>
        </ScrollView>
    )
}

export default NoInternet

const styles = StyleSheet.create({
    center: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    boldText: {
        fontSize: 20,
        fontWeight: 600,
        marginTop: 50
    },
    lightText: {
        fontSize: 14,
        fontWeight: 400,
        marginTop: 10
    },
    btn: {
        padding: 10,
        borderRadius: 10,
        width: "80%",
        marginTop: 25,
        borderColor: "#666",
        borderWidth: 1
    }
})