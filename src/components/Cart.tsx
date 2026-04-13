
// カート
"use client"

import { useCart } from "@/fooks/cart/useCart"
import { computeCartDisplayLogic } from "@/lib/cart/utils";
import CartSheet from "./CartSheet";
import CartDropDown from "./CartDropDown";


export default function Cart(){

  // ✅ ユーザーに紐づいたカート、アイテム、商品を全て取得
  const { carts, cartsError, isLoading, mutateCart } = useCart();
  // console.log(carts); 
  // [{ id: 1, restaurant_id: "ChIJZZPMQQDfAGARxEZtPATdWew", restaurantName: "RAMEN JUNKEYZ", photoUrl: "/no-image.jpeg", cart_items: [{ ... }, { ... }] }]

  // ① カートの種類(シートかドロップダウンで表示か) 
  // ② 店舗データ
  // ③ カートのアイテムの合計(quantity)
  const { displayMode, sheetCart, cartCount } = computeCartDisplayLogic(carts);
  // console.log(displayMode);
  // console.log(sheetCart)

  return displayMode === "cartSheet" ? (
    // ✅ カートが0件、または、1件の時 → スライド
    <CartSheet sheetCart={ sheetCart } cartCount={ cartCount } />
  ) : (
    // ✅ カートが2件以上の時 → ドロップダウン
    <CartDropDown />
  )
}