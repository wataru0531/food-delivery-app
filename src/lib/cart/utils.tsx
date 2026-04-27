
// /lib/cart/.utils.tsx
// ✅ カートの数によって表示を切り替える

import { CartItemType, CartType } from "@/types";


// ✅　カートアイテムのquantityの合計を求める
export function sumItems(cartItems: CartItemType[]) {
  // [{ id: 1, restaurant_id: "ChIJZZPMQQDfAGARxEZtPATdWew", restaurantName: "RAMEN JUNKEYZ", photoUrl: "/no-image.jpeg", cart_items: [{ ... }, { ... }] }]
  
  // console.log(cart.cart_items.reduce((sum, item) => {
  //   return sum + item.quantity
  // }, 0)); // 4

  return cartItems.reduce((sum, item) => { // 合計値, アイテム。初めのsumを0にする
    return sum + item.quantity
  }, 0)
}

// ✅　表示を切り替える処理
export function computeCartDisplayLogic(
  carts: CartType[] | undefined, 
  selectedCart: CartType | null,
  targetCart: CartType | null,
){
  // console.log(carts);
  // console.log(carts.length)
  // カートには何も入っていない場合
  if(!carts || carts.length === 0) {
    // ①カートの種類 ②店舗のデータ ③カートのアイテムの合計(quantity)
    return { displayMode: "cartSheet", sheetCart: null, cartCount: 0 }
  }

  // カートが1件のとき
  if(carts.length === 1) {
    const only = carts[0];
    // console.log(only)
    // console.log(sumItems(only));
    return { displayMode: "cartSheet", sheetCart: only, cartCount: sumItems(only.cart_items) }
  }

  // ✅　選択されたカートがある場合 → 複数の店舗で買い物をしてドロップダウンの店舗をクリックした時
  if(selectedCart) {
    return {
      displayMode: "cartSheet", // シートで表示
      sheetCart: selectedCart, // 表示したい店舗のデータ
      cartCount: sumItems(selectedCart.cart_items), // 合計数
    }
  }

  // ✅ ターゲットカートがある場合
  // → 店舗ページに行った時に、その店舗に紐づくカートのアイテムを表示
  if(targetCart) {
    return {
      displayMode: "cartSheet",
      sheetCart: targetCart,
      cartCount: sumItems(targetCart.cart_items)
    }
  }
  
  // カートに2つ以上のお店
  return { displayMode: "cartDropDown", sheetCart: null, cartCount: 0 };
}

