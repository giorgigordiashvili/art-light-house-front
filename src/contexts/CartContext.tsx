"use client";
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
>>>>>>> Stashed changes
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { CartService, CartItem } from "../lib/cartService";

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  isEmpty: boolean;
}

interface CartContextType {
  cart: CartState;
  loading: boolean;
  error: string | null;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  fetchCart: () => Promise<void>;
  clearError: () => void;
}

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "UPDATE_ITEM"; payload: { productId: number; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "CLEAR_CART" };

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
  isEmpty: true,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_CART": {
      const items = action.payload;
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return {
        items,
        totalItems,
        totalAmount,
        isEmpty: items.length === 0,
      };
    }
    case "ADD_ITEM": {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.productId === newItem.productId);

      let updatedItems;
      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item.productId === newItem.productId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, newItem];
      }

      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return {
        items: updatedItems,
        totalItems,
        totalAmount,
        isEmpty: false,
      };
    }
    case "UPDATE_ITEM": {
      const { productId, quantity } = action.payload;
      const updatedItems = state.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );

      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return {
        items: updatedItems,
        totalItems,
        totalAmount,
        isEmpty: updatedItems.length === 0,
      };
    }
    case "REMOVE_ITEM": {
      const productId = action.payload;
      const updatedItems = state.items.filter((item) => item.productId !== productId);

      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return {
        items: updatedItems,
        totalItems,
        totalAmount,
        isEmpty: updatedItems.length === 0,
      };
    }
    case "CLEAR_CART": {
      return initialState;
    }
    default:
      return state;
  }
<<<<<<< Updated upstream
=======
=======

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
>>>>>>> 696d478 (Delete clerk implementation from the project, Add login/registration using next-auth library)
>>>>>>> Stashed changes
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
<<<<<<< Updated upstream
  if (!context) {
=======
<<<<<<< HEAD
  if (!context) {
=======
  if (context === undefined) {
>>>>>>> 696d478 (Delete clerk implementation from the project, Add login/registration using next-auth library)
>>>>>>> Stashed changes
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
>>>>>>> Stashed changes
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const cartService = useMemo(() => new CartService(), []);

  const setLoadingState = (isLoading: boolean) => {
    setLoading(isLoading);
    dispatch({ type: "SET_LOADING", payload: isLoading });
  };

  const setErrorState = (error: string | null) => {
    setError(error);
    dispatch({ type: "SET_ERROR", payload: error });
  };

  const fetchCart = useCallback(async () => {
    try {
      setLoadingState(true);
      setErrorState(null);
      const cartData = await cartService.getCart();
      dispatch({ type: "SET_CART", payload: cartData });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch cart";
      setErrorState(errorMessage);
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoadingState(false);
    }
  }, [cartService]);

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      setLoadingState(true);
      setErrorState(null);
      const result = await cartService.addToCart(productId, quantity);

      if (result.success) {
        // Fetch updated cart after successful addition
        await fetchCart();
      } else {
        setErrorState(result.error || "Failed to add item to cart");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add item to cart";
      setErrorState(errorMessage);
      console.error("Failed to add item to cart:", err);
    } finally {
      setLoadingState(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      setLoadingState(true);
      setErrorState(null);
      const result = await cartService.updateCartItem(productId, quantity);

      if (result.success) {
        dispatch({ type: "UPDATE_ITEM", payload: { productId, quantity } });
      } else {
        setErrorState(result.error || "Failed to update item quantity");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update item quantity";
      setErrorState(errorMessage);
      console.error("Failed to update item quantity:", err);
    } finally {
      setLoadingState(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      setLoadingState(true);
      setErrorState(null);
      const result = await cartService.removeFromCart(productId);

      if (result.success) {
        dispatch({ type: "REMOVE_ITEM", payload: productId });
      } else {
        setErrorState(result.error || "Failed to remove item from cart");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to remove item from cart";
      setErrorState(errorMessage);
      console.error("Failed to remove item from cart:", err);
    } finally {
      setLoadingState(false);
    }
  };

  const clearError = () => {
    setErrorState(null);
  };

  // Fetch cart on component mount
  React.useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const contextValue: CartContextType = {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    fetchCart,
    clearError,
<<<<<<< Updated upstream
=======
=======
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
    cart: items, // Alias for compatibility
    itemCount,
    totalPrice,
    loading: false, // Cart is always loaded immediately
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    openCart,
    closeCart,
>>>>>>> 696d478 (Delete clerk implementation from the project, Add login/registration using next-auth library)
>>>>>>> Stashed changes
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};
