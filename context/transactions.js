const { useContext, createContext, useState } = require("react");

const Server_API = "https://expense-trackerr-server.vercel.app/api";

const TransactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {
    const [processing, setProcessing] = useState(false)
    const [processingDelete, setProcessingDelete] = useState(false)

    async function addNewTransaction(values) {
        try {
            setProcessing(true)

            const response = await fetch(
                `${Server_API}/transactions/Ru-dfrhm8399izhum`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to add transaction");
            }

            setProcessing(false);
            console.log("Transaction Added Successfully");
        } catch (error) {
            setProcessing(false);
            console.log("Error Adding Transaction:", error);
            throw new Error("Error Adding Transaction");
        }
    }

    async function saveEditedTransaction(transactionId, values) {
        try {
            setProcessing(true)

            const response = await fetch(
                `${Server_API}/transactions/Ru-dfrhm8399izhum/${transactionId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to edit transaction");
            }

            setProcessing(false);
            console.log("Transaction Editting Successfully");
        } catch (error) {
            setProcessing(false);
            console.log("Error Editting Transaction:", error);
            throw new Error("Error Editting Transaction");
        }
    }

    async function deleteTransaction(transactionId) {
        try {
            setProcessingDelete(true)

            const response = await fetch(
                `${Server_API}/transactions/Ru-dfrhm8399izhum/${transactionId}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete transaction");
            }

            setProcessingDelete(false);
            console.log("Transaction Delete Successfully");
        } catch (error) {
            setProcessingDelete(false);
            console.log("Error Delete Transaction:", error);
            throw new Error("Error Delete Transaction");
        }
    }

    return (
        <TransactionsContext.Provider
            value={{ processing, processingDelete, addNewTransaction, saveEditedTransaction, deleteTransaction }}
        >
            {children}
        </TransactionsContext.Provider>
    );
};

export const useTransactions = () => useContext(TransactionsContext);
