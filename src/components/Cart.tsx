
// カート

"use client"

import { useCart } from "@/fooks/cart/useCart"
import { computeCartDisplayLogic } from "@/lib/cart/utils";
import CartSheet from "./CartSheet";
import CartDropDown from "./CartDropDown";
import { useEffect, useState } from "react";
import type { CartType } from "@/types";
import { useCartVisibility } from "@/app/context/cartContext";
import { useParams } from "next/navigation";


export default function Cart(){
  // ✅ カートシートの開閉に関するコンテキストを取得
  const { isOpen, setIsOpen, openCart, closeCart } = useCartVisibility();

  const { restaurantId } = useParams<{restaurantId?: string}>(); // urlパラメータを取得。動的な値を取得できる
                                                                //  undefinedにもなる
  
  // ✅ ユーザーに紐づいたカート、アイテム、商品を全て取得
  const { carts, cartsError, isLoading, targetCart } = useCart(restaurantId);
  // console.log(carts);
  // [{ id: 1, restaurant_id: "ChIJZZPMQQDfAGARxEZtPATdWew", restaurantName: "RAMEN JUNKEYZ", photoUrl: "/no-image.jpeg", cart_items: [{ ... }, { ... }] }]

  // ✅ ドロップダウンで表示した店舗を選択した時のステート
  const [ selectedCart, setSelectedCart ] = useState<CartType | null>(null);
  // console.log(selectedCart);

  // ✅ リスト表示かドロップラウンかを切り替える処理
  // ① カートの種類(シートかドロップダウンで表示か) 
  // ② 店舗データ
  // ③ カートのアイテムの合計(quantity)
  const { displayMode, sheetCart, cartCount } = computeCartDisplayLogic(carts, selectedCart, targetCart);
  // console.log(displayMode);
  // console.log(sheetCart)

  // ✅ リスト形式の開閉状態を監視。
  useEffect(() => {
    if(isOpen) return; // リスト形式が閉じたらisOpenがfalse

    // ドロップダウンで表示した店舗を選択した時のステートをnullにする
    // → 完全にカートシートが閉じ切ってから発火させる。
    //   即切り替えると、カートシートが閉じる前に消えてしまうため
    setTimeout(() => setSelectedCart(null), 200);

  }, [ isOpen ])

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
    <CartSheet 
      sheetCart={ sheetCart } 
      cartCount={ cartCount } 
      isOpen={ isOpen } 
      openCart={ openCart }
      closeCart={ closeCart }
    />
  ) : (
    // ✅ カートが2件以上の時 → ドロップダウン
    // → 2つ以上の店舗で買い物をした時
    <CartDropDown 
      carts={ carts } 
      setSelectedCart={ setSelectedCart }
      openCart={ openCart }
    />
  )
}