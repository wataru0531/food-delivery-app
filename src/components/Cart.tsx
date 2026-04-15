
// カート
"use client"

import { useCart } from "@/fooks/cart/useCart"
import { computeCartDisplayLogic } from "@/lib/cart/utils";
import CartSheet from "./CartSheet";
import CartDropDown from "./CartDropDown";
import { useState } from "react";
import type { CartType } from "@/types";


export default function Cart(){

  // ✅ ユーザーに紐づいたカート、アイテム、商品を全て取得
  const { carts, cartsError, isLoading, mutateCart } = useCart();
  // console.log(carts); 
  // [{ id: 1, restaurant_id: "ChIJZZPMQQDfAGARxEZtPATdWew", restaurantName: "RAMEN JUNKEYZ", photoUrl: "/no-image.jpeg", cart_items: [{ ... }, { ... }] }]

  // ✅ ドロップダウンで表示した店舗を選択した時のステート
  const [ selectedCart, setSelectedCart ] = useState<CartType | null>(null);
  // console.log(selectedCart);

  // ① カートの種類(シートかドロップダウンで表示か) 
  // ② 店舗データ
  // ③ カートのアイテムの合計(quantity)
  const { displayMode, sheetCart, cartCount } = computeCartDisplayLogic(carts, selectedCart);
  // console.log(displayMode);
  // console.log(sheetCart)

  if(cartsError) {
    return <div>{ cartsError.message }</div>;
  }

  if(isLoading || !carts) {
    return <div>Loading...</div>;
  }
  // → この下では、cartsがundefinedではないことを証明できる
  //   ※ useSWRは、データの取得が完了するまでundefinedを返す

  return displayMode === "cartSheet" ? (
    // ✅ カートが0件、または、1件の時 → スライド
    // → 1つの店舗でも買い物をしていない時、または、1つの店舗でしか買い物をしていない時
    <CartSheet sheetCart={ sheetCart } cartCount={ cartCount } />
  ) : (
    // ✅ カートが2件以上の時 → ドロップダウン
    // → 2つ以上の店舗で買い物をした時
    <CartDropDown carts={ carts } setSelectedCart={setSelectedCart} />
  )
}