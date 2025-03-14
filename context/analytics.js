const { useContext, createContext, useState } = require("react");

const Server_API = "https://expense-trackerr-server.vercel.app/api";

const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  const [analytics, setAnalytics] = useState({
    totalSpent: 0,
    totalEarned: 0,
    totalAmount: 0,
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${Server_API}/analytics/Ru-dfrhm8399izhum`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      setLoadingAnalytics(false);
      setAnalytics(data);
      console.log("Fetched Analytics");
    } catch (error) {
      console.log("Error Fetching Analytics Data: ", error);
      throw new Error("Error Fetching Analytics Data");
    }
  };

  return (
    <AnalyticsContext.Provider
      value={{ analytics, loadingAnalytics, fetchAnalytics }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => useContext(AnalyticsContext);
