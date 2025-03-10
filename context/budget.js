const { useContext, useState } = require("react");
const { createContext } = require("react");

const Server_API = "https://expense-trackerr-server.vercel.app/api";

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budgetProcessing, setBudgetProcessing] = useState(false);
  const [budgetDeleting, setBudgetDeleting] = useState(false);

  async function addNewBudget(values) {
    try {
      setBudgetProcessing(true);

      const response = await fetch(`${Server_API}/budgets/Ru-dfrhm8399izhum`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add budget");
      }

      setBudgetProcessing(false);
      console.log("Budget Added Successfully");
    } catch (error) {
      setBudgetProcessing(false);
      console.log("Error Adding Budget:", error);
      throw new Error("Error Adding Budget");
    }
  }

  async function saveEditedBudget(budgetId, values) {
    try {
      setBudgetProcessing(true);

      const response = await fetch(`${Server_API}/budgets/Ru-dfrhm8399izhum/${budgetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to Edit budget");
      }

      setBudgetProcessing(false);
      console.log("Budget Edited Successfully");
    } catch (error) {
      setBudgetProcessing(false);
      console.log("Error Editing Budget:", error);
      throw new Error("Error Editing Budget");
    }
  }

  async function deleteBudget(budgetId) {
    try {
      setBudgetDeleting(true);

      const response = await fetch(`${Server_API}/budgets/Ru-dfrhm8399izhum/${budgetId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to Delete budget");
      }

      setBudgetDeleting(false);
      console.log("Budget Deleted Successfully");
    } catch (error) {
      setBudgetDeleting(false);
      console.log("Error Deleting Budget:", error);
      throw new Error("Error Deleting Budget");
    }
  }

  return (
    <BudgetContext.Provider
      value={{ addNewBudget, saveEditedBudget, deleteBudget, budgetProcessing, budgetDeleting }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => useContext(BudgetContext);
