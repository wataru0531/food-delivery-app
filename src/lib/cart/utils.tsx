
// /lib/cart/.utils.tsx
// ✅ カートの数によって表示を切り替える

import { CartType } from "@/types";


// ✅　カートアイテムのquantityの合計を求める
function sumItems(cart: CartType) {
  // [{ id: 1, restaurant_id: "ChIJZZPMQQDfAGARxEZtPATdWew", restaurantName: "RAMEN JUNKEYZ", photoUrl: "/no-image.jpeg", cart_items: [{ ... }, { ... }] }]
  
  // console.log(cart.cart_items.reduce((sum, item) => {
  //   return sum + item.quantity
  // }, 0)); // 4

  return cart.cart_items.reduce((sum, item) => { // 合計値, アイテム。初めのsumを0にする
    return sum + item.quantity
  }, 0)
}

// ✅　表示を切り替える処理
export function computeCartDisplayLogic(carts: CartType[] | undefined) {
  // console.log(carts);
  // console.log(carts.length)
  // カートには何も入っていない場合
  if(!carts || carts.length === 0) {
    // ①カートの種類 ②店舗データや入れたアイテムのデータ ③カートのアイテムの合計(quantity)
    return { displayMode: "cartSheet", sheetCart: null, cartCount: 0 }
  }

  // カートが1件のとき
  if(carts.length === 1) {
    const only = carts[0];
    // console.log(only)
    // console.log(sumItems(only));
    return { displayMode: "cartSheet", sheetCart: only, cartCount: sumItems(only) }
  }

  // カートに2つ以上のお店
  return { displayMode: "cartDropDown", sheetCart: null, cartCount: 0 };

}

