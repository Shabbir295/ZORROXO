import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

// 🔥 RATE 1 KAR DIYA HAI (No Conversion, Direct Price)
export const currencies = {
  USD: { symbol: '$', rate: 1, name: 'US Dollar' },
  PKR: { symbol: 'Rs.', rate: 1, name: 'Pakistani Rupee' },
  INR: { symbol: '₹', rate: 1, name: 'Indian Rupee' },
  GBP: { symbol: '£', rate: 1, name: 'British Pound' },
  AED: { symbol: 'د.إ', rate: 1, name: 'UAE Dirham' },
  EUR: { symbol: '€', rate: 1, name: 'Euro' },
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('zorroxo_currency') || 'USD';
  });

  useEffect(() => {
    localStorage.setItem('zorroxo_currency', currency);
  }, [currency]);

  // 🔥 Ab ye direct price return karega, bina kisi calculation ke
  const formatPrice = (price) => {
    const symbol = currencies[currency]?.symbol || '$';
    return `${symbol}${Number(price).toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, currencies }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);