import { SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import React, { useMemo } from "react";
import { Text, View } from "../Themed";
import { useTransactionsCategory } from "@/context/transCategory";
import { useUserData } from "@/context/user";
import { useTransactionFilter } from "@/context/filterTransByDate";
import { formatAmount } from "@/utils/formatAmount";
import { useColorScheme } from "@/components/useColorScheme";
import { router } from "expo-router";

interface Transaction {
  _id: string;
  amount: number;
  createdAt: Date;
  category: {
    type: "Spent" | "Earned" | "Borrowed" | "Lend";
    hexColor: string;
  };
}

interface TypeSpent {
  type: Transaction["category"]["type"];
  color: string;
  total: number;
}

const typeColors: Record<Transaction["category"]["type"], string> = {
  Spent: "#FF6667",
  Earned: "#42D7B5",
  Borrowed: "#F8B501",
  Lend: "#1869FF",
};

const TypesSquares = () => {
  const { setDonutCategory } = useTransactionsCategory();
  const { transactionsList, loadingUserDetails, currencyObj } = useUserData();
  const { donutTransactionsFilter } = useTransactionFilter();

  const colorScheme = useColorScheme();
  const bgColor = colorScheme === "dark" ? "#2A2C38" : "#FFF";
  const oppColor = colorScheme === "dark" ? "#000" : "#FFF";

  const filteredTransactions = useMemo(() => {
    return transactionsList?.filter((txn: Transaction) => {
      const createdAtDate = new Date(txn.createdAt);
      const fromDate = new Date(donutTransactionsFilter.from);
      const toDate = new Date(donutTransactionsFilter.to);

      return createdAtDate >= fromDate && createdAtDate <= toDate;
    });
  }, [transactionsList, donutTransactionsFilter]);

  const typeSpending: TypeSpent[] = useMemo(() => {
    const spendingMap = new Map<Transaction["category"]["type"], TypeSpent>();

    // Initialize all types with 0 total
    Object.keys(typeColors).forEach((type) => {
      spendingMap.set(type as Transaction["category"]["type"], {
        type: type as Transaction["category"]["type"],
        color: typeColors[type as Transaction["category"]["type"]],
        total: 0,
      });
    });

    filteredTransactions?.forEach((txn: Transaction) => {
      const typeKey = txn.category.type;

      spendingMap.get(typeKey)!.total += txn.amount;
    });

    return Array.from(spendingMap.values());
  }, [filteredTransactions]);

  const totalBalance = typeSpending.reduce((sum, txn) => {
    if (txn.type == "Spent" || txn.type == "Lend") {
      sum = sum - txn.total
    } else {
      sum = sum + txn.total
    }

    return sum;
  }, 0)

  const handleShowCategory = (type: string) => {
    setDonutCategory(type);
    router.push({ pathname: "/typeDonut" });
  };

  return (
    <>
      {!loadingUserDetails ?
        <View style={[styles.balanceCard, { backgroundColor: bgColor }]}>
          <Text style={styles.title}>Total Balance:</Text>
          <Text style={styles.balanceAmount}>{formatAmount(totalBalance, currencyObj)}</Text>
        </View>
        :
        <View style={[styles.balanceCard, { backgroundColor: bgColor, paddingVertical: 30 }]} />
      }

      <SafeAreaView style={styles.conatiner}>
        {!loadingUserDetails
          ? typeSpending.map((type) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleShowCategory(type.type)}
              key={type.color}
              disabled={type.total == 0}
              style={[styles.card, { backgroundColor: bgColor }]}
            >
              <Text style={styles.title}>{type.type}</Text>

              <Text numberOfLines={1} style={styles.price}>
                {formatAmount(type.total, currencyObj)}
              </Text>

              <SafeAreaView
                style={[
                  styles.viewMore,
                  {
                    backgroundColor:
                      type.total == 0 ? `${type.color}90` : type.color,
                  },
                ]}
              >
                <Text style={{ fontWeight: 500, color: oppColor }}>
                  View More
                </Text>
              </SafeAreaView>
            </TouchableOpacity>
          ))
          : [...Array(4)].map((_, index) => (
            <View
              key={index}
              style={[styles.card, { height: 160, backgroundColor: bgColor }]}
            />
          ))}
      </SafeAreaView>
    </>
  );
};

export default TypesSquares;

const styles = StyleSheet.create({
  conatiner: {
    rowGap: 15,
    columnGap: 7,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 30,
  },
  card: {
    padding: 15,
    paddingVertical: 20,
    borderRadius: 12,
    width: "48%",
  },
  balanceCard: {
    padding: 15,
    paddingVertical: 20,
    borderRadius: 12,
    marginBottom: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    textAlign: "center",
  },
  price: {
    fontSize: 22,
    fontWeight: 500,
    textAlign: "center",
    marginVertical: 25,
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: 500
  },
  viewMore: {
    alignSelf: "center",
    paddingHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 7,
  },
});
