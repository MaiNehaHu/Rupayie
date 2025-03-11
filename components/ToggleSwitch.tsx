import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const ToggleSwitch = ({ isOn, setIsOn }: { isOn: boolean, setIsOn: (isOn: boolean) => void; }) => {
    const translateX = useRef(new Animated.Value(isOn ? 20 : -5)).current;

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: isOn ? 20 : -5,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [isOn]);

    const toggleSwitch = () => {
        setIsOn(!isOn);
    };

    return (
        <TouchableOpacity onPress={toggleSwitch} activeOpacity={0.8}>
            <LinearGradient
                colors={isOn ? ["#5794ff", "#4760ff"] : ["#333", "#555"]}
                style={[styles.switchContainer, isOn && styles.switchOn]}
            >
                <Animated.View
                    style={[
                        styles.circle,
                        { transform: [{ translateX }] },
                        isOn ? styles.circleOn : styles.circleOff,
                    ]}
                />
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    switchContainer: {
        width: 40,
        height: 18,
        borderRadius: 20,
        justifyContent: "center",
        padding: 2,
        elevation: 5,
    },
    switchOn: {
        backgroundColor: "#D3D3D3",
    },
    circle: {
        width: 23,
        height: 23,
        borderRadius: 13,
        backgroundColor: "#FFF",
        elevation: 5,
    },
    circleOn: {
        backgroundColor: "#005eff",
        shadowColor: "#AAA",
    },
    circleOff: {
        backgroundColor: "#707070",
        shadowColor: "#000",
    },
});

export default ToggleSwitch;
