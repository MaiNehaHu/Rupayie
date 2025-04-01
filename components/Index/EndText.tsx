import { SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import { Text, View } from '../Themed'
import { useColorScheme } from "@/components/useColorScheme";

const EndText = () => {
    const colorScheme = useColorScheme();
    const placeholderColor = colorScheme === "dark" ? "#d6d6d6" : "#575757";

    return (
        <SafeAreaView style={{ marginVertical: 10, marginBottom: 40, marginLeft: 5 }}>
            <Text style={{ color: placeholderColor, fontSize: 20, fontWeight: 500 }}>
                Track, plan, and grow.
            </Text>
            <Text style={{ color: placeholderColor, fontSize: 30, fontWeight: 500 }}>
                Your money, your rules
            </Text>
        </SafeAreaView>
    )
}

export default EndText

const styles = StyleSheet.create({})