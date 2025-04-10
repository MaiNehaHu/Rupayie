import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Text, View } from '../Themed'
import { useColorScheme } from "@/components/useColorScheme";
import { FontAwesome6 } from '@expo/vector-icons';
import { formatAmount } from '@/utils/formatAmount';
import { formatDate } from '@/utils/formatDateTimeSimple';
import { useUserData } from '@/context/user';

interface People {
    name: string;
    _id: string;
    relation: string;
    contact: string
}

interface Transaction {
    _id: string;
    amount: number;
    createdAt: Date;
    category: {
        type: "Spent" | "Earned" | "Borrowed" | "Lend";
        hexColor: string;
        sign: "+" | "-";
        name: string
    };
}

const ExpandableCard = ({ people, transactions, categoryName }: { people: People, transactions: Transaction[], categoryName: string }) => {
    const { name, relation } = people;

    const { currencyObj } = useUserData();
    const colorScheme = useColorScheme();
    const textColor = colorScheme === "dark" ? "#FFF" : "#000";

    const [expand, setExpland] = useState(false);

    const totalBalance = transactions
        .reduce((sum, curr) =>
            sum += curr.category.sign === "+" ? curr.amount : -curr.amount, 0);

    const totalTaken = transactions
        .reduce((sum: number, acc: Transaction) =>
            sum += acc.category.sign == "+" ? acc.amount : 0, 0);

    const totalGiven = transactions
        .reduce((sum: number, acc: Transaction) =>
            sum += acc.category.sign == "-" ? acc.amount : 0, 0)

    return (
        <View style={styles.card}>
            <TouchableOpacity
                onPress={() => setExpland((prev) => !prev)}
                activeOpacity={0.7}
            >
                <SafeAreaView style={[styles.flex_row_btw, { marginBottom: 5 }]}>
                    <Text numberOfLines={1} style={{ fontSize: 16, fontWeight: 500, maxWidth: "50%" }}>{name}</Text>
                    <Text numberOfLines={1} style={{ fontSize: 16, fontWeight: 500, maxWidth: "50%" }}>{formatAmount(totalBalance, currencyObj)}</Text>
                </SafeAreaView>

                <SafeAreaView style={styles.flex_row_btw}>
                    <Text numberOfLines={1} style={{ maxWidth: "50%" }}>{categoryName}</Text>
                    <FontAwesome6
                        size={16}
                        color={textColor}
                        name={expand ? "caret-down" : "caret-right"}
                    />
                </SafeAreaView>
            </TouchableOpacity>

            {expand &&
                <SafeAreaView style={[styles.flex_col, styles.expndedCont]}>
                    <SafeAreaView style={styles.flex_row_btw}>
                        <Text style={[styles.tableHeader, { textAlign: "left" }]}>Date</Text>
                        <Text style={[styles.tableHeader, { textAlign: "right" }]}>You Got</Text>
                        <Text style={[styles.tableHeader, { textAlign: "right" }]}>You Gave</Text>
                    </SafeAreaView>

                    {transactions.reduce((acc: JSX.Element[], txn, idx) => {
                        const previousBalance = acc.length > 0 ? acc[acc.length - 1].props.balance : 0;
                        const newBalance = txn.category.sign === '+'
                            ? previousBalance + txn.amount
                            : previousBalance - txn.amount;

                        acc.push(
                            <TableRow
                                key={txn._id}
                                txn={txn}
                                balance={newBalance}
                            />
                        );

                        return acc;
                    }, [])}

                    <SafeAreaView style={[styles.flex_row_btw, { borderTopColor: "#888", borderTopWidth: 0.5, paddingTop: 5 }]}>
                        <Text style={[styles.tableHeader, { textAlign: "left" }]}>Total</Text>
                        <Text style={[styles.tableHeader, { textAlign: "right" }]}>{formatAmount(totalTaken, currencyObj)}</Text>
                        <Text style={[styles.tableHeader, { textAlign: "right" }]}>{formatAmount(totalGiven, currencyObj)}</Text>
                    </SafeAreaView>
                </SafeAreaView>
            }
        </View>
    )
}

const TableRow = ({ txn, balance }: { txn: Transaction, balance: number }) => {
    const { currencyObj } = useUserData();
    return (
        <SafeAreaView style={styles.flex_row_btw}>
            <Text style={{ width: "33%", textAlign: "left" }}>{formatDate(txn.createdAt)}</Text>
            <Text numberOfLines={1} style={{ width: "33%", textAlign: "right" }}>
                {txn.category.sign === '+' ? `${formatAmount(txn.amount, currencyObj)}` : '-'}
            </Text>
            <Text numberOfLines={1} style={{ width: "33%", textAlign: "right" }}>
                {txn.category.sign === '-' ? `${formatAmount(txn.amount, currencyObj)}` : '-'}
            </Text>
        </SafeAreaView>
    )
}

export default ExpandableCard

const styles = StyleSheet.create({
    card: {
        padding: 12, borderRadius: 10,
    },
    flex_col: {
        display: "flex",
        gap: 7,
    },
    flex_row_btw: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    expndedCont: {
        borderTopColor: "#888888",
        borderTopWidth: 0.5,
        marginTop: 10,
        paddingTop: 10
    },
    tableHeader: {
        width: "33%",
        fontWeight: 500,
    }
})