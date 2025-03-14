import { createContext, useState, useContext } from "react";

const Server_API = "https://expense-trackerr-server.vercel.app/api";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  async function searchForKeyWord(keyWord) {
    try {
      setIsSearching(true);
      const response = await fetch(
        `${Server_API}/search/Ru-dfrhm8399izhum/${keyWord}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch search results.");
      }

      const data = await response.json();
      setSearchResult(data);
      setIsSearching(false);
    } catch (error) {
      console.error("Error Searching:", error.message);
      setSearchResult([]);
    }
  }

  return (
    <SearchContext.Provider
      value={{ isSearching, searchResult, searchForKeyWord }}
    >
      {children}
    </SearchContext.Provider>
  );
};

// Custom Hook
export const useSearch = () => useContext(SearchContext);
