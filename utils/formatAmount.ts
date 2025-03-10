export const formatAmount = (amount: number, currency: any) => {
  const formattedAmount = !amount
    ? `0.0`
    : amount
        // Ensures two decimal places
        ?.toFixed(2)
        // Adds thousand separator
        .replace(/\d(?=(\d{3})+\.)/g, `$&${currency.thousandSeparator}`)
        // Replaces decimal separator if needed
        .replace(".", currency.decimalSeparator);

  return currency.side === "left"
    ? `${currency.symbol}${formattedAmount}`
    : `${formattedAmount}${currency.symbol}`;
};
