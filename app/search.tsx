import {
  Animated,
  Easing,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import { TextInput } from "react-native";
import { useUserData } from "@/context/user";
import { formatAmount } from "@/utils/formatAmount";
import formatDateTimeSimple from "@/utils/formatDateTimeSimple";
import { FontAwesome6 } from "@expo/vector-icons";
import ReadTransaction from "@/components/Modals/ReadTransaction";

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

const Search = () => {
  const { categoriesList, transactionsList } = useUserData();
  const colorScheme = useColorScheme();
  const bgColor = colorScheme === "dark" ? "#1C1C1C" : "#EDEDED";
  const textColor = colorScheme === "dark" ? "#FFF" : "#000";
  const oppTextColor = colorScheme === "light" ? "#FFF" : "#000";
  const placeholderColor = colorScheme === "dark" ? "#c2c2c2" : "#4d4d4d";

  const [input, setInput] = useState("");
  const [searchResultList, setSearchResultList] = useState(transactionsList);
  const [type, setType] = useState("Spent");
  const [category, setCategory] = useState(categoriesList[1]?.name);

  const [clickedTransaction, setClickedTransaction] = useState<Transaction>();
  const [showClickedTransaction, setShowClickedTransaction] = useState(false);

  const slideModalAnim = useRef(new Animated.Value(200)).current; // Start position off-screen

  function handleTransView(transaction: Transaction) {
    setClickedTransaction(transaction);
    openModal();
  }

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
    const filteredTransactions =
      transactionsList &&
      transactionsList.filter((txn: Transaction) => {
        const matchesText = input
          ? txn.note.toLowerCase().includes(input.toLowerCase()) ||
            txn.category.name.toLowerCase().includes(input.toLowerCase()) ||
            txn.category.type.toLowerCase().includes(input.toLowerCase()) ||
            txn.amount.toString().includes(input)
          : true;

        const matchesType = type ? txn.category.type === type : true;
        const matchesCategory = category
          ? txn.category.name === category
          : true;

        return matchesText && matchesType && matchesCategory;
      });

    setSearchResultList(filteredTransactions);
  }, [input, type, category, transactionsList]);

  useEffect(() => {
    setCategory(
      categoriesList?.filter((categ: any) => categ.type === type)[0]?.name
    );
  }, [type]);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <TextInput
        onChangeText={setInput}
        placeholder="Search Here..."
        placeholderTextColor={placeholderColor}
        style={[
          styles.inputField,
          { borderColor: textColor, color: textColor },
        ]}
      />

      <SafeAreaView style={styles.categoriesFilter}>
        {["Spent", "Earned", "Borrowed", "Lend"].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterButton,
              {
                backgroundColor: type === cat ? "#006cf7" : oppTextColor,
                borderColor: type === cat ? "#4588DF" : textColor,
              },
            ]}
            onPress={() => setType(cat)}
          >
            <Text style={{ color: type === cat ? "white" : textColor }}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </SafeAreaView>

      <SafeAreaView style={styles.categoriesFilter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categoriesList &&
            categoriesList
              .filter((categ: any) => categ.type === type)
              .map(({ name }: { name: string }) => (
                <TouchableOpacity
                  key={name}
                  style={[
                    styles.filterButton,
                    {
                      marginRight: 10,
                      backgroundColor:
                        category === name ? "#006cf7" : oppTextColor,
                      borderColor: category === name ? "#4588DF" : textColor,
                    },
                  ]}
                  onPress={() => setCategory(name)}
                >
                  <Text
                    style={{ color: category === name ? "white" : textColor }}
                  >
                    {name}
                  </Text>
                </TouchableOpacity>
              ))}
        </ScrollView>
      </SafeAreaView>

      <ScrollView style={{ marginTop: 10 }}>
        {searchResultList.length > 0 ? (
          searchResultList.map((txn: Transaction) => (
            <TouchableOpacity
              key={txn._id}
              activeOpacity={0.6}
              onPress={() => handleTransView(txn)}
            >
              <TransactionCard {...txn} />
            </TouchableOpacity>
          ))
        ) : (
          <>
            <Text style={{ textAlign: "center", marginTop: 40 }}>
              <FontAwesome6
                name="circle-exclamation"
                size={40}
                color={textColor}
              />
            </Text>
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No transactions found.
            </Text>
          </>
        )}
      </ScrollView>

      {showClickedTransaction && clickedTransaction && (
        <ReadTransaction
          isVisible={showClickedTransaction}
          slideModalAnim={slideModalAnim}
          handleCloseModal={handleCloseModal}
          transaction={clickedTransaction}
        />
      )}
    </View>
  );
};

const TransactionCard = ({
  _id,
  note,
  amount,
  category,
  status,
  pushedIntoTransactions,
  image,
  createdAt,
  people,
}: Transaction) => {
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

          <Text style={styles.text}>{category?.name}</Text>
        </SafeAreaView>

        {/* Amount */}
        <Text style={styles.text}>{formatAmount(amount, currencyObj)}</Text>
      </SafeAreaView>

      <SafeAreaView
        style={[
          styles.flex_row_end_btw,
          { paddingBottom: 12, marginTop: 7 },
          //   { paddingBottom: isRecurring ? 7 : 12, marginTop: 7 },
        ]}
      >
        {/* Note */}
        <SafeAreaView style={{ width: "60%" }}>
          <Text numberOfLines={1} style={styles.smallText}>
            {note}
          </Text>
        </SafeAreaView>

        {/* Date */}
        <Text style={styles.createdAtText}>
          {formatDateTimeSimple(createdAt)}
        </Text>
      </SafeAreaView>

      {/* Image */}
      {/* {image && (
        <SafeAreaView style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
        </SafeAreaView>
      )} */}

      {/* Auto added */}
      {/* {isRecurring && (
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
      )} */}
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingBottom: 0,
  },
  inputField: {
    width: "100%",
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1.5,
    marginBottom: 15,
  },
  transactionsCard: {
    borderRadius: 10,
    paddingTop: 12,
    marginBottom: 7,
  },
  flex_row_end_btw: {
    paddingHorizontal: 15,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  flex_row: {
    gap: 7,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  categoryCircle: {
    width: 15,
    height: 15,
    borderRadius: 20,
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
  recurring: {
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
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
  categoriesFilter: {
    marginBottom: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 30,
    borderWidth: 1.5,
    // marginRight: 15,
  },
});
