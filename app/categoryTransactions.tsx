import { Animated, Easing, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Text, View } from '@/components/Themed'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useUserData } from '@/context/user'
import { useColorScheme } from "@/components/useColorScheme";
import { TransactionCard } from '@/components/Two/Transactions'
import ReadTransaction from '@/components/Modals/ReadTransaction'
import { formatAmount } from '@/utils/formatAmount'

interface Transaction {
    _id: string;
    amount: number;
    category: {
        name: string;
        hexColor: string;
        sign: string;
        type: string;
        _id: string;
    };
    note: string;
    pushedIntoTransactions: boolean;
    status: string;
    people: {
        name: string;
        relation: string;
        contact: number;
        _id: string;
    };
    createdAt: Date;
    image: string;
}

const categoryTransactions = () => {
    const navigation = useNavigation()
    const route = useLocalSearchParams();

    const transaltionsList = typeof route.transactions === "string"
        ? JSON.parse(route.transactions)
        : route.clickedBudget;

    const clickedCategory = typeof route.category === "string"
        ? JSON.parse(route.category)
        : route.clickedBudget;

    const colorScheme = useColorScheme();
    const { loadingUserDetails, currencyObj } = useUserData();

    const [categoryTransactionsList, setCategoryTransactionsList] = useState(transaltionsList)

    const [clickedTransaction, setClickedTransaction] = useState<Transaction>();
    const [showClickedTransaction, setShowClickedTransaction] = useState(false);

    const loaderColor = colorScheme === "dark" ? "#2e2e2e" : "#e3e3e3";
    const bgColor = colorScheme === "dark" ? "#1C1C1C" : "#EDEDED";

    function handleTransView(transaction: Transaction) {
        setClickedTransaction(transaction);
        openModal();
    }

    const slideModalAnim = useRef(new Animated.Value(200)).current; // Start position off-screen

    const openModal = () => {
        setShowClickedTransaction(true);

        setTimeout(() => {
            Animated.timing(slideModalAnim, {
                toValue: 0, // Slide up
                duration: 200,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        }, 100);
    };

    const handleCloseModal = () => {
        Animated.timing(slideModalAnim, {
            toValue: 700, // Move back down off-screen
            duration: 200,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
        }).start(() => {
            setShowClickedTransaction(false);
        });
    };

    useEffect(() => {
        navigation.setOptions({
            title: `${clickedCategory.name}`,
            headerRight: () => (
                <Text style={{ fontWeight: 500, fontSize: 16 }}>
                    {formatAmount(clickedCategory.spent, currencyObj)}
                </Text>
            )
        })
    }, [route.category]);

    useEffect(() => {
        setCategoryTransactionsList((prev: Transaction[]) =>
            prev.filter((transaction) => transaction.category._id === clickedCategory._id)
        );
    }, [route.transactions]);

    return (
        <ScrollView style={[styles.mainContainer, { backgroundColor: bgColor }]}>
            <SafeAreaView>
                <View style={styles.container}>
                    {!loadingUserDetails ? (
                        <SafeAreaView style={styles.transactionContainer}>
                            {categoryTransactionsList?.length > 0 ? (
                                categoryTransactionsList.map((transaction: Transaction) => {
                                    const {
                                        _id,
                                        amount,
                                        category,
                                        note,
                                        createdAt,
                                        pushedIntoTransactions,
                                        image,
                                        people,
                                        status,
                                    } = transaction;

                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => handleTransView(transaction)}
                                            key={_id.toString()}
                                        >
                                            <TransactionCard
                                                _id={_id}
                                                amount={amount}
                                                category={category}
                                                note={note}
                                                createdAt={createdAt}
                                                pushedIntoTransactions={pushedIntoTransactions}
                                                image={image}
                                                status={status}
                                                people={people}
                                            />
                                        </TouchableOpacity>
                                    );
                                })
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
                        </SafeAreaView>
                    ) : (
                        Array.from({ length: 5 }).map((_, index) => (
                            <View
                                key={index}
                                style={[styles.cardSkeleton, { backgroundColor: loaderColor }]}
                            ></View>
                        ))
                    )}
                </View>

                {showClickedTransaction && clickedTransaction && (
                    <ReadTransaction
                        isVisible={showClickedTransaction}
                        slideModalAnim={slideModalAnim}
                        handleCloseModal={handleCloseModal}
                        transaction={clickedTransaction}
                    />
                )}
            </SafeAreaView>
        </ScrollView>
    )
}

export default categoryTransactions

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 15,
    },
    container: {
        flex: 1,
        backgroundColor: "transparent",
        marginBottom: 20,
    },
    transactionContainer: {
        gap: 10,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "transparent",
    },
    cardSkeleton: {
        height: 65,
        borderRadius: 10,
        width: "100%",
        marginBottom: 10,
    },
})