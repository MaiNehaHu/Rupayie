const { useContext, createContext, useState } = require("react");

const Server_API = "https://expense-trackerr-server.vercel.app/api";

const TranshContext = createContext();

export const TranshProvider = ({ children }) => {
  const [isTransDeleting, setIsTransDeleting] = useState(false);
  const [isTrashCleaning, setIsTrashCleaning] = useState(false);
  const [isReverting, setIsReverting] = useState(false);
  const [autoDeleteStatus, setAutoDeleteStatus] = useState(false);

  async function deleteTranshTrans(transactionId) {
    try {
      setIsTransDeleting(true);

      const response = await fetch(
        `${Server_API}/trash/Ru-dfrhm8399izhum/${transactionId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        setIsTransDeleting(false);
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete transaction");
      }

      setIsTransDeleting(false);
      console.log("Transaction Deleted from Trash Successfully");
    } catch (error) {
      console.log("Error Delete Transaction from Trash: ", error)
      throw new Error("Error Delete Transaction from Trash")
    }
  }

  async function emptyTrash() {
    try {
      setIsTrashCleaning(true);
      const response = await fetch(
        `${Server_API}/empty-trash/Ru-dfrhm8399izhum`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        setIsTrashCleaning(false);
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to clean trash");
      }

      setIsTrashCleaning(false);
      console.log("Trash Cleaned Successfully");
    } catch (error) {
      console.log("Error Cleaning Trash: ", error);
      throw new Error("Error Cleaning Trash");
    }
  }

  async function revertTrashTransaction(transactionId) {
    try {
      setIsReverting(true);

      const response = await fetch(
        `${Server_API}/trash/revert/Ru-dfrhm8399izhum/${transactionId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        setIsReverting(false);
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to revert transaction");
      }

      setIsReverting(false);
      console.log("Transaction Reverted from Trash Successfully");
    } catch (error) {
      console.log("Error Delete Transaction from Trash:", error);
      throw new Error("Error Delete Transaction from Trash");
    }
  }

  async function autoCleanTrashAfterWeek(autoCleanFlag) {
    try {
      const response = await fetch(
        `${Server_API}/users/Ru-dfrhm8399izhum`,
        {
          method: "PUT",
          body: JSON.stringify({ settings: { autoCleanTrash: autoCleanFlag } }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to Turn On Trash Clean After a Week");
      }

      const data = await response.json();

      console.log("Sucessfully Turned On Trash Clean After a Week to: ", data.settings.autoCleanTrash)
    } catch (error) {
      console.log("Error Turning On Trash Clean After a Week:", error);
      throw new Error("Error Turning On Trash Clean After a Week");
    }
  }

  return (
    <TranshContext.Provider
      value={{
        deleteTranshTrans,
        emptyTrash,
        isTransDeleting,
        isTrashCleaning,
        isReverting,
        revertTrashTransaction,
        autoDeleteStatus,
        autoCleanTrashAfterWeek
      }}
    >
      {children}
    </TranshContext.Provider>
  );
};

export const useTrash = () => useContext(TranshContext);
