import { Image, Platform, RefreshControl, StatusBar, StyleSheet, TouchableOpacity, } from 'react-native'
import React, { useState } from 'react'
import { Text, View } from '@/components/Themed'
import { useColorScheme } from "@/components/useColorScheme";
import { SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Slider from '../slider';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { ScrollView } from 'react-native';
import ExchangedRecords from '@/components/Four/ExchangedRecords';
import { useAnalytics } from '@/context/analytics';
import { useUserData } from '@/context/user';
import Header from '@/components/Header';

const GradientImage = require("@/assets/pages/gradientBg.png");

const Four = () => {
    const colorScheme = useColorScheme();
    const { fetchAnalytics } = useAnalytics();
    const { fetchUserDetails } = useUserData();

    const [sliderVisible, setSliderVisible] = useState(false);
    const [refresh, setRefresh] = useState(false);

    async function refreshPage() {
        setRefresh(true);

        try {
            console.log("Fetching on Reload");

            await fetchUserDetails();
            await fetchAnalytics();
        } catch (error) {
            console.error("Error Refreshing: ", error);
        } finally {
            setRefresh(false);
        }
    }

    function showSlider() {
        setSliderVisible(true);
    }
    function hideSlider() {
        setSliderVisible(false);
    }

    const statusBarHeight = Platform.OS === "ios" ? getStatusBarHeight() : StatusBar.currentHeight || 36;
    const textColor = colorScheme === "dark" ? "#fff" : "#000";

    return (
        <View
            style={[
                styles.conatiner,
                { backgroundColor: colorScheme === "dark" ? "#1C1C1C" : "#EDEDED" },
            ]}
        >
            <Image
                source={GradientImage}
                style={{
                    position: "absolute",
                    zIndex: 0,
                    height: 160,
                    objectFit: "cover",
                }}
            />

            <StatusBar backgroundColor={"transparent"} />

            <View style={styles.bodyContainer}>
                <Header showSlider={showSlider} />

                {/* <SafeAreaView style={[styles.flex_row, { marginTop: statusBarHeight + 10, marginBottom: 15 }]}>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => showSlider()}>
                        <FontAwesome
                            name="bars"
                            size={22}
                            style={{
                                color: textColor,
                                marginHorizontal: 15,
                            }}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Shared Records</Text>
                </SafeAreaView> */}

                <Slider isVisible={sliderVisible} hideSlider={hideSlider} />

                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={() => refreshPage()}
                            colors={["#000"]}
                        />
                    }
                    style={styles.paddings}>
                    <ExchangedRecords />
                </ScrollView>
            </View>
        </View>
    )
}

export default Four

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
    },
    bodyContainer: {
        flex: 1,
        position: "relative",
        backgroundColor: "transparent",
    },
    paddings: {
        padding: 15,
        paddingTop: 0,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    headerText: {
        fontWeight: 600,
        fontSize: 22,
        marginTop: -5,
    },
    flex_row: {
        display: "flex",
        flexDirection: "row",
        gap: 15
    }
})