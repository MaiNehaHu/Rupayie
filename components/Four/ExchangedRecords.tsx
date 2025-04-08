import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Text } from '../Themed';
import { useColorScheme } from "@/components/useColorScheme";

import { useUserData } from '@/context/user';
import ExpandableCard from './ExpandableCard';
import { FontAwesome6 } from '@expo/vector-icons';
import { Skeleton } from '../Two/Transactions';

interface People {
    name: string;
    _id: string;
    relation: string;
    contact: string
}

const ExchangedRecords = () => {
    const { transactionsList, peopleList, loadingUserDetails } = useUserData();

    const colorScheme = useColorScheme();
    const textColor = colorScheme === "dark" ? "#FFF" : "#000";
    const bgColor = colorScheme === "dark" ? "#000" : "#FFF";
    const loaderColor = colorScheme === "dark" ? "#2e2e2e" : "#e3e3e3";

    const [activeButton, setActiveButton] = useState<string>("Borrowed");

    return (
        <SafeAreaView>
            <SafeAreaView style={[styles.flex_row_btw, { marginTop: 5, marginBottom: 15 }]}>
                {["Borrowed", "Lend"]
                    .map((button) => (
                        <TouchableOpacity
                            key={button}
                            onPress={() => setActiveButton(button)}
                            activeOpacity={0.7}
                            style={[styles.flex_row_btw, styles.button, { width: "48%", backgroundColor: activeButton == button ? "#4588DF" : bgColor }]}
                        >
                            <Text style={{ fontSize: 16, fontWeight: 500 }}>{button}</Text>
                            <FontAwesome6
                                name={button ===
                                    "Borrowed"
                                    ? "credit-card"
                                    : "money-bills"}
                                color={textColor}
                                size={24}
                            />
                        </TouchableOpacity>
                    ))
                }
            </SafeAreaView>

            <SafeAreaView style={styles.flex_col}>
                {loadingUserDetails ?
                    <Skeleton loaderColor={loaderColor} />
                    : peopleList?.length > 0 ?
                        peopleList
                            .map((people: People) => {
                                const exchangedTransaction = transactionsList?.filter(
                                    (txn: any) =>
                                        txn.category?.type === activeButton &&
                                        txn.people?._id === people._id
                                );
                                return {
                                    people,
                                    transactions: exchangedTransaction
                                };
                            })
                            .filter((item: any) => item.transactions.length > 0)
                            .map(({ people, transactions }: { people: People, transactions: any }) => (
                                <ExpandableCard
                                    key={people._id}
                                    people={people}
                                    transactions={transactions.reverse()} // !important
                                />
                            )) : (
                            <Text style={{
                                marginTop: 50,
                                textAlign: "center",
                                fontStyle: "italic",
                            }}>
                                No Record
                            </Text>)
                }
            </SafeAreaView>
        </SafeAreaView>
    );
};


export default ExchangedRecords

const styles = StyleSheet.create({
    flex_col: {
        display: "flex",
        gap: 10
    },
    flex_row_btw: {
        gap: 10,
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-between",
    },
    button: {
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 10
    }
})