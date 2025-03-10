const { useContext, createContext, useState } = require("react");

const Server_API = "https://expense-trackerr-server.vercel.app/api";

const TranshContext = createContext();

export const TranshProvider = ({ children }) => {
  const [isTransDeleting, setIsTransDeleting] = useState(false);
  const [isTrashCleaning, setIsTrashCleaning] = useState(false);
  const [isReverting, setIsReverting] = useState(false);

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
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete transaction");
      }

      console.log("Transaction Deleted from Trash Successfully");
    } catch (error) {
      console.log("Error Delete Transaction from Trash: ", error)
      throw new Error("Error Delete Transaction from Trash")
    } finally {
      setIsTransDeleting(false);
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
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to clean trash");
      }

      console.log("Trash Cleaned Successfully");
    } catch (error) {
      console.log("Error Cleaning Trash: ", error);
      throw new Error("Error Cleaning Trash");
    } finally {
      setIsTrashCleaning(false);
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
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to revert transaction");
      }

      console.log("Transaction Reverted from Trash Successfully");
    } catch (error) {
      console.log("Error Delete Transaction from Trash:", error);
      throw new Error("Error Delete Transaction from Trash");
    } finally {
      setIsReverting(false)
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
        revertTrashTransaction
      }}
    >
      {children}
    </TranshContext.Provider>
  );
};

export const useTrash = () => useContext(TranshContext);
