
// cartContext → カートに関するコンテキスト

"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

type CartContextType = {
  isOpen: boolean; // カートシートにkannsuru開閉状態
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);


export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [ isOpen, setIsOpen ] = useState(false);

  const openCart = () => {
    setIsOpen(true);
  }

  const closeCart = () => {
    setIsOpen(false);    
  }

  return (
    <CartContext.Provider value={{ isOpen, setIsOpen, openCart, closeCart }}>
      { children }
    </CartContext.Provider>
  )
}

// ✅ グローバルコンテキストの値を取得するカスタムフック
//    → CartProvider内でしか値を取れない。undefinedになる
export const useCartVisibility = () => {
  const context = useContext(CartContext);
  if(!context) throw new Error("useCartVisibilityはCartProvider内で使用する必要があります。");

  return context;
}
