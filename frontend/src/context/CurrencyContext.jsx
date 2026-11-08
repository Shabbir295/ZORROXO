import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const currencies = {
  USD: { symbol: '$', rate: 1, name: 'US Dollar' },
  PKR: { symbol: 'Rs.', rate: 278, name: 'Pakistani Rupee' },
  INR: { symbol: '₹', rate: 83, name: 'Indian Rupee' },
  GBP: { symbol: '£', rate: 0.79, name: 'British Pound' },
  AED: { symbol: 'د.إ', rate: 3.67, name: 'UAE Dirham' },
  EUR: { symbol: '€', rate: 0.92, name: 'Euro' },
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('zorroxo_currency') || 'USD';
  });

  useEffect(() => {
    localStorage.setItem('zorroxo_currency', currency);
  }, [currency]);

  const convertPrice = (priceInUSD) => {
    const rate = currencies[currency]?.rate || 1;
    return (priceInUSD * rate).toFixed(2);
  };

  const formatPrice = (priceInUSD) => {
    const symbol = currencies[currency]?.symbol || '$';
    return `${symbol}${convertPrice(priceInUSD)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);