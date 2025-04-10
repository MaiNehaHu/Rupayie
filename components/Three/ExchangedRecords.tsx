import { SafeAreaView, StyleSheet } from 'react-native';
import React from 'react';
import { Text } from '../Themed';
import { useColorScheme } from "@/components/useColorScheme";

import { useUserData } from '@/context/user';
import ExpandableCard from './ExpandableCard';
import { Skeleton } from '../Two/Transactions';
import { useTransactionsCategory } from '@/context/transCategory';

interface People {
    name: string;
    _id: string;
    relation: string;
    contact: string;
}

const ExchangedRecords = () => {
    const { transactionsList, peopleList, loadingUserDetails } = useUserData();
    const { sharedCategory } = useTransactionsCategory()

    const colorScheme = useColorScheme();
    const loaderColor = colorScheme === "dark" ? "#2e2e2e" : "#e3e3e3";

    if (loadingUserDetails) {
        return <Skeleton loaderColor={loaderColor} />;
    }

    if (!peopleList || peopleList.length === 0 || !transactionsList || transactionsList.length === 0) {
        return (
            <Text style={styles.noRecordText}>No Record</Text>
        );
    }

    return (
        <SafeAreaView style={{ marginBottom: 30 }}>
            <SafeAreaView style={styles.flex_col}>
                {peopleList.map((people: People) => {
                    // Get all transactions for this person
                    const personTxns = transactionsList.filter(
                        (txn: { people: People, category: { type: string } }) =>
                            txn.people?._id === people._id &&
                            txn.category.type === sharedCategory
                    );

                    // Group by category.name
                    const groupedByCategory = personTxns.reduce((acc: any, txn: any) => {
                        const categoryName = txn.category?.name || 'Uncategorized';

                        if (!acc[categoryName]) acc[categoryName] = [];
                        acc[categoryName].push(txn);

                        return acc;
                    }, {});

                    // Render each category separately
                    return Object.entries(groupedByCategory).map(([categoryName, txns]: any) => (
                        <ExpandableCard
                            key={`${people._id}-${categoryName}`}
                            people={people}
                            categoryName={categoryName}
                            transactions={txns.reverse()}
                        />
                    ));
                })}
            </SafeAreaView>
        </SafeAreaView>
    );
};

export default ExchangedRecords;

const styles = StyleSheet.create({
    flex_col: {
        display: "flex",
        gap: 10,
    },
    noRecordText: {
        marginTop: 50,
        textAlign: "center",
        fontStyle: "italic",
    }
});
