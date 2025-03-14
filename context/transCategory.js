const { useContext, useState } = require("react");
const { createContext } = require("react");

const TransactionsCategoryContext = createContext();

export const TransactionsCategoryProvider = ({ children }) => {
  const [clickedTransCategory, setClickedTransCategory] = useState("Spent");
  const [donutCategory, setDonutCategory] = useState("Spent");

  return (
    <TransactionsCategoryContext.Provider
      value={{ clickedTransCategory, setClickedTransCategory, donutCategory, setDonutCategory }}
    >
      {children}
    </TransactionsCategoryContext.Provider>
  );
};

export const useTransactionsCategory = () =>
  useContext(TransactionsCategoryContext);
