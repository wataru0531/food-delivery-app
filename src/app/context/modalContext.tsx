
// モーダルのステート

"use client";

import { MenuType } from "@/types";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

type ModalContextType = {
  isOpen: boolean; // モーダルの開閉状態
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  openModal: (menu: MenuType) => void;
  closeModal: () => void;
  selectedItem: MenuType | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [ isOpen, setIsOpen ] = useState(false);
  const [ selectedItem, setSelectedItem ] = useState<MenuType | null>(null);

  const openModal = (menu: MenuType) => {
    setIsOpen(true);
    setSelectedItem(menu);
  }

  const closeModal = () => {
    setIsOpen(false);
    
    setTimeout(() => setSelectedItem(null), 200)
  }

  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen, openModal, closeModal, selectedItem }}>
      { children }
    </ModalContext.Provider>
  )
}

// ✅ グローバルコンテキストの値を取得するカスタムフック
//    → ModalProvider内でしか値を取れない。undefinedになる
export const useModal = () => {
  const context = useContext(ModalContext);
  if(!context) throw new Error("useModalはModalProvider内で使用する必要があります。");

  return context;
}
