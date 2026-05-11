import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: number | string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  size: string;
  color?: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (item: CartItem, showCart?: boolean) => void;
  removeItem: (id: number | string, size: string, color?: string) => void;
  updateQuantity: (id: number | string, size: string, color: string | undefined, delta: number) => void;
  clearCart: () => void;
  total: number;
  subtotal: number;
  totalDiscount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addItem = (item: CartItem, showCart: boolean = true) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id && i.size === item.size && i.color === item.color);
      if (existing) {
        return prev.map(i => 
          (i.id === item.id && i.size === item.size && i.color === item.color) 
            ? { ...i, quantity: i.quantity + item.quantity } 
            : i
        );
      }
      return [...prev, item];
    });
    if (showCart) {
      setIsCartOpen(true);
    }
  };

  const removeItem = (id: number | string, size: string, color?: string) => {
    setCartItems(prev => prev.filter(i => !(i.id === id && i.size === size && i.color === color)));
  };

  const updateQuantity = (id: number | string, size: string, color: string | undefined, delta: number) => {
    setCartItems(prev => prev.map(i => {
      if (i.id === id && i.size === size && i.color === color) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.oldPrice || item.price) * item.quantity, 0);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiscount = subtotal - total;

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      isCartOpen, 
      setIsCartOpen, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart,
      total,
      subtotal,
      totalDiscount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
