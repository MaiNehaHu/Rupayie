import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { Text, View } from '../Themed'
import { useColorScheme } from "@/components/useColorScheme";
import { useUserData } from '@/context/user';
import { FontAwesome6 } from '@expo/vector-icons';
import { formatAmount } from '@/utils/formatAmount';
import { router } from 'expo-router';
import { useTransactionsCategory } from '@/context/transCategory';
import { useTransactionFilter } from '@/context/filterTransByDate';

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
    createdAt: string;
    image: string;
}

interface CategorySpent {
    _id: string;
    name: string;
    hexColor: string;
    spent: number;
}

const DonutTransactions = () => {
    const { donutCategory } = useTransactionsCategory();
    const { transactionsList, currencyObj } = useUserData();
    const { donutTransactionsFilter } = useTransactionFilter()

    const colorScheme = useColorScheme();
    const lightText = colorScheme === "dark" ? "#b5b5b5" : "#404040"

    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        // Filter transactions based on category and date range
        const filtered = transactionsList
            ?.filter(({ category }: any) => category.type === donutCategory)
            .filter(({ createdAt }: any) => {
                const createdAtDate = new Date(createdAt);
                const fromDate = new Date(donutTransactionsFilter.from);
                const toDate = new Date(donutTransactionsFilter.to);

                return createdAtDate >= fromDate && createdAtDate <= toDate;
            });

        setFilteredTransactions(filtered);
    }, [donutCategory, transactionsList, donutTransactionsFilter]);

    // Aggregate total amount spent per category
    const categorySpending: CategorySpent[] = useMemo(() => {
        const spendingMap = new Map<string, CategorySpent>();

        filteredTransactions?.forEach((txn: Transaction) => {
            const { _id, name, hexColor } = txn.category;
            if (!spendingMap.has(_id)) {
                spendingMap.set(_id, { _id, name, hexColor, spent: 0 });
            }
            spendingMap.get(_id)!.spent += txn.amount;
        });

        return Array.from(spendingMap.values());
    }, [filteredTransactions]);

    // Compute the total amount spent across all categories
    const totalAmountSpent = useMemo(() => categorySpending.reduce((total, item) => total + item.spent, 0), [categorySpending]);

    function handleCategoryClick(category: CategorySpent) {
        router.push(
            {
                pathname: "/categoryTransactions",
                params: {
                    category: JSON.stringify(category),
                    transactions: JSON.stringify(filteredTransactions)
                }
            })
    }

    return (
        <SafeAreaView style={styles.container}>
            {categorySpending.map((cat: CategorySpent) => (
                <TouchableOpacity activeOpacity={0.8} key={cat._id} onPress={() => handleCategoryClick(cat)}>
                    <View style={[styles.catCart, styles.flex_row_btw]}>
                        <View style={styles.flex_row}>
                            <View style={[styles.circle, { backgroundColor: cat.hexColor }]} />
                            <Text style={{ fontWeight: '500' }}>
                                {totalAmountSpent > 0 ? Math.ceil((cat.spent / totalAmountSpent) * 100) : 0}%
                            </Text>
                            <Text numberOfLines={1} style={{ width: "50%" }}>{cat.name}</Text>
                        </View>

                        <SafeAreaView style={styles.flex_row}>
                            <Text style={{ fontWeight: '500' }}>{formatAmount(cat.spent, currencyObj)}</Text>
                            <FontAwesome6 name="angle-right" size={16} color={lightText} />
                        </SafeAreaView>
                    </View>
                </TouchableOpacity>
            ))}
        </SafeAreaView >
    )
}

export default DonutTransactions;

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginBottom: 20
    },
    flex_row_btw: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    flex_row: {
        gap: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    catCart: {
        padding: 12,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    circle: {
        width: 28,
        height: 28,
        borderRadius: 30,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
})