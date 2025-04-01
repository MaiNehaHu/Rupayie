import AsyncStorage from "@react-native-async-storage/async-storage";

const { useContext, useState } = require("react");
const { createContext } = require("react");

const Server_API = "https://expense-trackerr-server.vercel.app/api";

const EditNotificationContext = createContext();

export const EditNotificationProvider = ({ children }) => {
  const [cleaning, setCleaning] = useState(false);

  async function setNotificationRead(notificationId, values) {
    const storedUserId = await AsyncStorage.getItem("loggedUserId");

    try {
      const response = await fetch(
        `${Server_API}/notifications/${storedUserId}/${notificationId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to set read transaction");
      }

      // console.log("Transaction Set Read Successfully");
    } catch (error) {
      console.log("Error Setting Read Transaction: ", error);
      throw new Error("Error Setting Read Transaction");
    }
  }

  async function deleteAllNotifications() {
    const storedUserId = await AsyncStorage.getItem("loggedUserId");

    try {
      setCleaning(true);
      const response = await fetch(
        `${Server_API}/notifications/${storedUserId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        setCleaning(false);
        throw new Error("Failed to delete notifications");
      }

      setCleaning(false);
      // console.log("Transaction Set Read Successfully");
    } catch (error) {
      setCleaning(false);
      console.log("Error Deleting Notifications: ", error);
      throw new Error("Error Deleting Notifications");
    }
  }

  return (
    <EditNotificationContext.Provider value={{ cleaning, setNotificationRead, deleteAllNotifications }}>
      {children}
    </EditNotificationContext.Provider>
  );
};

export const useEditNotifications = () => useContext(EditNotificationContext);
