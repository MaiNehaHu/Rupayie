import {
  Animated,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "../Themed";
import { SafeAreaView } from "react-native";
import { useColorScheme } from "@/components/useColorScheme";

import { formatAmount } from "@/utils/formatAmount";
import formatDateTimeSimple from "@/utils/formatDateTimeSimple";
import { useTransactionsCategory } from "@/context/transCategory";
import { FontAwesome6 } from "@expo/vector-icons";
import { useUserData } from "@/context/user";
import { Easing } from "react-native";
import ReadTransaction from "@/components/Modals/ReadTransaction";
import { useTransactionFilter } from "@/context/filterTransByDate";

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

const Transactions = () => {
  const colorScheme = useColorScheme();
  const { clickedTransCategory } = useTransactionsCategory();
  const { transactionsList, loadingUserDetails } = useUserData();
  const { transactionsFilter } = useTransactionFilter();
  const [transactions, setTransactions] =
    useState<Transaction[]>(transactionsList);
  const [clickedTransaction, setClickedTransaction] = useState<Transaction>();
  const [showClickedTransaction, setShowClickedTransaction] = useState(false);

  const loaderColor = colorScheme === "dark" ? "#2e2e2e" : "#e3e3e3";

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
    setTransactions(
      transactionsList
        ?.filter(({ category }: any) => category.type === clickedTransCategory)
        .filter(({ createdAt }: any) => {
          const createdAtDate = new Date(createdAt);
          const fromDate = new Date(transactionsFilter.from);
          const toDate = new Date(transactionsFilter.to);

          return createdAtDate >= fromDate && createdAtDate <= toDate;
        })
    );
  }, [clickedTransCategory, transactionsList, transactionsFilter]);

  return (
    <>
      <View style={styles.container}>
        {!loadingUserDetails ? (
          <SafeAreaView style={styles.transactionContainer}>
            {transactions?.length > 0 ? (
              transactions.map((transaction: Transaction, index: number) => {
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
                    key={index}
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
    </>
  );
};

export const TransactionCard = ({
  _id,
  amount,
  category,
  note,
  createdAt,
  pushedIntoTransactions,
  image,
  people,
  status,
}: Transaction) => {
  const { clickedTransCategory } = useTransactionsCategory();

  const { currencyObj } = useUserData();
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#FFF" : "#000";
  const lightText = colorScheme == "dark" ? "#D9D9D9" : "#5C5C5C";

  const isRecurring =
    (pushedIntoTransactions == false || pushedIntoTransactions == true) &&
    pushedIntoTransactions !== undefined;

  return (
    <View style={styles.transactionsCard}>
      <SafeAreaView style={styles.flex_row_end_btw}>
        {/* Category */}
        <SafeAreaView style={styles.flex_row}>
          <View
            style={[
              styles.categoryCircle,
              { backgroundColor: category.hexColor },
            ]}
          ></View>

          <Text style={styles.text}>{category.name}</Text>
        </SafeAreaView>

        {/* Amount */}
        <Text style={styles.text}>{formatAmount(amount, currencyObj)}</Text>
      </SafeAreaView>

      <SafeAreaView
        style={[
          styles.flex_row_end_btw,
          { paddingBottom: isRecurring ? 7 : 12, marginTop: 7 },
        ]}
      >
        {/* Note */}
        {clickedTransCategory === "Borrowed" ||
        clickedTransCategory === "Lend" ? (
          <SafeAreaView
            style={{
              width: "60%",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            <Text numberOfLines={1} style={styles.smallText}>
              {people?.name}
            </Text>
            {/* 
              <Text>{" - "}</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => Linking.openURL(`tel:${people?.contact}`)}
              >
                <Text
                  style={[styles.smallText, { textDecorationLine: "underline" }]}
                >
                  {people?.contact}
                </Text>
              </TouchableOpacity>
             */}
          </SafeAreaView>
        ) : (
          <SafeAreaView style={{ width: "60%" }}>
            <Text numberOfLines={1} style={styles.smallText}>
              {note}
            </Text>
          </SafeAreaView>
        )}

        {/* Date */}
        <Text style={styles.createdAtText}>
          {formatDateTimeSimple(createdAt)}
        </Text>
      </SafeAreaView>

      {/* Image */}
      {image && (
        <SafeAreaView style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
        </SafeAreaView>
      )}

      {/* Auto added */}
      {isRecurring && (
        <>
          <SafeAreaView
            style={[
              styles.flex_row,
              styles.recurring,
              { backgroundColor: `${category.hexColor}60` },
            ]}
          >
            <FontAwesome6
              name="repeat"
              size={12}
              style={{ color: iconColor }}
            />
            <Text style={[styles.smallItalicText, { color: lightText }]}>
              Auto added by recurring
            </Text>
          </SafeAreaView>
        </>
      )}
    </View>
  );
};

export default Transactions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    marginBottom: 30,
  },
  transactionContainer: {
    gap: 10,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "transparent",
  },
  heading: {
    fontWeight: 600,
    fontSize: 18,
  },
  text: {
    fontSize: 16,
  },
  smallText: {
    fontSize: 12,
  },
  smallItalicText: {
    fontSize: 12,
    fontStyle: "italic",
  },
  createdAtText: {
    fontSize: 10,
    textAlign: "right",
  },
  flex_row: {
    gap: 7,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  flex_row_start_btw: {
    width: "100%",
    display: "flex",
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  flex_row_end_btw: {
    paddingHorizontal: 15,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "#4FB92D",
  },
  addText: {
    fontWeight: 500,
    color: "#FFF",
  },
  transactionsCard: {
    borderRadius: 10,
    paddingTop: 12,
  },
  recurring: {
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  categoryCircle: {
    width: 15,
    height: 15,
    borderRadius: 20,
  },
  cardSkeleton: {
    height: 65,
    borderRadius: 10,
    width: "100%",
    marginBottom: 10,
  },
  image: {
    borderRadius: 5,
    width: "100%",
    height: 60,
    overflow: "hidden",
    objectFit: "cover",
    backgroundColor: "#666666",
  },
  imageContainer: {
    paddingBottom: 12,
    paddingHorizontal: 12,
  },
});
