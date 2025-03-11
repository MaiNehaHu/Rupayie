const { useContext, createContext, useState } = require("react");

const Server_API = "https://expense-trackerr-server.vercel.app/api";

const UserContext = createContext();

export const UserDetailsProvider = ({ children }) => {
  const [userDetails, setUserDetailsDetails] = useState();
  const [transactionsList, setTransactionsList] = useState();
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [trashTransactions, setTrashTransactions] = useState([]);
  const [notificationsList, setNotificationsList] = useState([]);
  const [categoriesList, setCategoriessList] = useState([]);
  const [peopleList, setPeopleList] = useState([]);
  const [budgetList, setBudgetList] = useState([]);
  const [currencyObj, setCurrencyObj] = useState({
    symbol: "₹",
    side: "left",
    decimalSeparator: ".",
    thousandSeparator: ",",
  });
  const [autoCleanTrash, setAutoCleanTrash] = useState(false);
  const [biometricFlag, setBiometricFlag] = useState(false);

  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [savingUserName, setSavingUserName] = useState(false);
  const [savingUserProfile, setSavingUserProfile] = useState(false);

  const fetchUserDetails = async () => {
    try {
      setLoadingUserDetails(true);

      const response = await fetch(`${Server_API}/users/Ru-dfrhm8399izhum`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setUserDetailsDetails(data);
      setLoadingUserDetails(false);

      setTransactionsList(
        data.transactions.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
      setRecentTransactions(
        data.transactions
          .slice(0, 5)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
      );
      setRecurringTransactions(
        data.recuringTransactions
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
      );
      setNotificationsList(
        data.notifications.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
      setTrashTransactions(
        data.trash.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );

      setCategoriessList(data.categories);
      setPeopleList(data.people);
      setBudgetList(data.budgets);
      setCurrencyObj(data.settings.currency);
      setAutoCleanTrash(data.settings.autoCleanTrash);
      setBiometricFlag(data.biometric);

      console.log("Fetched User Details");
    } catch (error) {
      console.log("Error Fetching User Details Data: ", error);
      throw new Error("Error Fetching User Details Data");
    }
  };

  const updateUserDetails = async (values, field) => {
    try {
      if (field === "name") setSavingUserName(true);
      else setSavingUserProfile(true);

      const response = await fetch(
        `${Server_API}/users/Ru-dfrhm8399izhum/`,
        {
          method: "PUT",
          body: JSON.stringify(values),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user details");
      }

      setSavingUserName(false)
      setSavingUserProfile(false)
      console.log("User Details Updated Successfully");
    } catch (error) {
      setSavingUserName(false)
      setSavingUserProfile(false)
      console.error("Error Updating User Details Data: ", error);
      throw new Error("Error Updating User Details Data");
    }
  }

  async function handleBiometricToggle(biometricFlag) {
    try {
      const response = await fetch(
        `${Server_API}/users/Ru-dfrhm8399izhum`,
        {
          method: "PUT",
          body: JSON.stringify({ biometric: biometricFlag }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to Toggled Biometric");
      }

      const data = await response.json();

      console.log("Sucessfully Toggled Biometric to: ", data.settings.autoCleanTrash)
    } catch (error) {
      console.log("Error Turning Switching Biometric:", error);
      throw new Error("Error Turning Switching Biometric");
    }
  }

  return (
    <UserContext.Provider
      value={{
        userDetails,
        loadingUserDetails,
        savingUserName,
        savingUserProfile,
        fetchUserDetails,
        updateUserDetails,
        transactionsList,
        recentTransactions,
        recurringTransactions,
        trashTransactions,
        notificationsList,
        categoriesList,
        peopleList,
        budgetList,
        currencyObj,
        autoCleanTrash,
        biometricFlag,
        handleBiometricToggle
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserData = () => useContext(UserContext);
