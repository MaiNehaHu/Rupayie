import { createContext, useContext, useState } from "react"

const FilterByDateContext = createContext()

export const FilterByDateProvider = ({ children }) => {
    const [transactionsFilter, setTransactionsFilter] = useState({
        title: "All Time",
        from: new Date(2000, 0, 1),
        to: new Date(),
    });
    const [donutTransactionsFilter, setDonutTransactionsFilter] = useState({
        title: "All Time",
        from: new Date(2000, 0, 1),
        to: new Date(),
    });

    return (
        <FilterByDateContext.Provider
            value={{
                transactionsFilter,
                setTransactionsFilter,
                donutTransactionsFilter,
                setDonutTransactionsFilter
            }}
        >
            {children}
        </FilterByDateContext.Provider>
    )
}

export const useTransactionFilter = () => useContext(FilterByDateContext)