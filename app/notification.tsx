import {
  Alert,
  Animated,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import { Text, View } from "@/components/Themed";
import { ScrollView } from "react-native";
import { useColorScheme } from "@/components/useColorScheme";
import { useUserData } from "@/context/user";
import { formatAmount } from "@/utils/formatAmount";
import { Ionicons } from "@expo/vector-icons";
import { Easing } from "react-native";
import ReadTrash from "@/components/Modals/ReadTrash";
import { useEditNotifications } from "@/context/editNotification";

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

interface Notification {
  _id: string;
  header: string;
  read: boolean;
  transaction: Transaction;
  type: string;
}

const Notification = () => {
  const { notificationsList, fetchUserDetails } = useUserData();
  const { setNotificationRead } = useEditNotifications();

  const colorScheme = useColorScheme();
  const bgCOlor = colorScheme === "dark" ? "#1C1C1C" : "#EDEDED";

  const [showTransaction, setShowTransaction] = useState<boolean>(false);
  const [modalTransaction, setModalTransaction] = useState<Transaction>(
    notificationsList[0]?.transaction
  );

  const slideModalAnim = useRef(new Animated.Value(200)).current; // Start position off-screen

  async function handleModalOpen(txn: Notification) {
    try {
      setModalTransaction(txn.transaction);
      openModal();

      markNotificationRead(txn);
    } catch (error) {
      console.log("Failed to Set Read");
    }
  }

  async function markNotificationRead(txn: Notification) {
    if (!txn.read) {
      await setNotificationRead(txn._id, {
        ...txn.transaction,
        read: true,
      });

      // refetch
      await fetchUserDetails();
    }
  }

  const openModal = () => {
    setShowTransaction(true);

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
      setShowTransaction(false);
    });
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <>
        <View style={[styles.conatiner, { backgroundColor: bgCOlor }]}>
          {notificationsList.length > 0 ? (
            notificationsList.map((not: Notification, index: number) => (
              <TouchableOpacity
                activeOpacity={0.7}
                key={index}
                onPress={() => handleModalOpen(not)}
              >
                <NotificationCard notification={not} />
              </TouchableOpacity>
            ))
          ) : (
            <Text
              style={{
                textAlign: "center",
                marginTop: 20,
                fontStyle: "italic",
              }}
            >
              No Notifications
            </Text>
          )}
        </View>
      </>

      {showTransaction && (
        <ReadTrash
          visible={showTransaction}
          slideModalAnim={slideModalAnim}
          handleCloseModal={handleCloseModal}
          transaction={modalTransaction}
          showActionButtons={false}
        />
      )}
    </ScrollView>
  );
};

const NotificationCard = ({ notification }: { notification: Notification }) => {
  const { currencyObj } = useUserData();

  return (
    <View style={styles.notificationCard}>
      <Text
        style={{
          marginBottom: 7,
          fontSize: 16,
          fontWeight: notification.read ? 400 : 600,
        }}
      >
        {notification.header}
      </Text>

      <SafeAreaView style={styles.flex_row_btw}>
        <SafeAreaView style={[styles.headerBox, { maxWidth: "50%" }]}>
          <View
            style={[
              styles.categoryCircle,
              { backgroundColor: notification.transaction.category.hexColor },
            ]}
          ></View>
          <Text numberOfLines={1} style={{ fontWeight: notification.read ? 400 : 600 }}>
            {notification.transaction.category.name}
          </Text>
        </SafeAreaView>

        <Text
          style={[styles.header, { fontWeight: notification.read ? 400 : 600 }]}
        >
          {formatAmount(notification.transaction.amount, currencyObj)}
          {notification.transaction.category.sign === "+" ? (
            <Ionicons name="arrow-down" size={14} />
          ) : (
            <Ionicons name="arrow-up" size={14} />
          )}
        </Text>
      </SafeAreaView>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    minHeight: "100%",
    padding: 15,
    display: "flex",
    gap: 8,
  },
  header: {
    fontSize: 16,
  },
  categoryCircle: {
    width: 15,
    height: 15,
    borderRadius: 30,
  },
  flex_row_btw: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerBox: {
    borderRadius: 30,
    gap: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  notificationCard: {
    borderRadius: 10,
    padding: 15,
  },
});
