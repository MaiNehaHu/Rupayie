import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text } from '../Themed';
import { useColorScheme } from "@/components/useColorScheme";

import { useUserData } from '@/context/user';
import ExpandableCard from './ExpandableCard';
import { FontAwesome6 } from '@expo/vector-icons';
import { Skeleton } from '../Two/Transactions';
import { useTransactionsCategory } from '@/context/transCategory';

interface People {
    name: string;
    _id: string;
    relation: string;
    contact: string
}

const ExchangedRecords = () => {
    const { transactionsList, peopleList, loadingUserDetails } = useUserData();
    const { sharedCategory } = useTransactionsCategory()

    const colorScheme = useColorScheme();
    const loaderColor = colorScheme === "dark" ? "#2e2e2e" : "#e3e3e3";

    return (
        <SafeAreaView style={{ marginBottom: 30 }}>
            <SafeAreaView style={styles.flex_col}>
                {loadingUserDetails ?
                    <Skeleton loaderColor={loaderColor} />
                    : peopleList?.length > 0 ?
                        peopleList
                            .map((people: People) => {
                                const exchangedTransaction = transactionsList?.filter(
                                    (txn: any) =>
                                        txn.category?.type === sharedCategory &&
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
})