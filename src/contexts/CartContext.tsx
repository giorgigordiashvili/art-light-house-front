"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Cart item interface
export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  attributes?: Record<string, any>;
}

// Cart context interface
interface CartContextType {
  items: CartItem[];
  cart: CartItem[]; // Alias for compatibility
  itemCount: number;
  totalPrice: number;
  loading: boolean;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (newItem: Omit<CartItem, "id">) => {
    setItems((prev) => {
      const existingItem = prev.find(
        (item) =>
          item.productId === newItem.productId &&
          JSON.stringify(item.attributes) === JSON.stringify(newItem.attributes)
      );

      if (existingItem) {
        return prev.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }

      return [...prev, { ...newItem, id: Date.now() + Math.random() }];
    });
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const contextValue: CartContextType = {
    items,
    cart: items,
    itemCount,
    totalPrice,
    loading: false,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};
