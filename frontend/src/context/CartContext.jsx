import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // LocalStorage se pehle ka data uthao (agar hai toh)
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('zorroxo_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Jab bhi cart change ho, localStorage mein save karo
  useEffect(() => {
    localStorage.setItem('zorroxo_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, size = 'M') => {
    setCartItems((prev) => {
      // Check karo ke product pehle se cart mein hai ya nahi (same id aur size)
      const existing = prev.find((item) => item.id === product.id && item.size === size);
      
      if (existing) {
        // Agar hai toh quantity barhao
        return prev.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      // Agar nahi hai toh naya add karo
      return [...prev, { ...product, quantity, size }];
    });
  };

  const removeFromCart = (id, size) => {
    setCartItems((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id, size, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  // Total items count (Navbar ke liye)
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);