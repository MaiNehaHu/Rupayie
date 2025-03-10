const { useContext, useState } = require("react");
const { createContext } = require("react");

const Server_API = "https://expense-trackerr-server.vercel.app/api";

const EditNotificationContext = createContext();

export const EditNotificationProvider = ({ children }) => {
  async function setNotificationRead(transactionId, values) {
    try {
      const response = await fetch(
        `${Server_API}/notifications/Ru-dfrhm8399izhum/${transactionId}`,
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

      console.log("Transaction Set Read Successfully");
    } catch (error) {
      console.log("Error Setting Read Transaction: ", error);
      throw new Error("Error Setting Read Transaction");
    }
  }

  return (
    <EditNotificationContext.Provider value={{ setNotificationRead }}>
      {children}
    </EditNotificationContext.Provider>
  );
};

export const useEditNotifications = () => useContext(EditNotificationContext);
