
// カートに関するカスタムフック

import { CartType } from "@/types";
import useSWR from "swr";

// ✅ useSWRは、fetcherで取得したデータをキャッシュしている。
//    ここでは、Route HandlerのGETがキャッシュされているわけではない。
const fetcher = async (url: string) => {
  const response = await fetch(url); // `/api/cart`。ここでroute.tsxのGETが動く
                                     // 

  if(!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  const data = await response.json();
  return data;
}


// ✅ カートのデータを取得。渡したidに紐づく
// ① レストランのid  
// ② データの再検証をするかどうか
//    → SWRを使ってるコンポーネントがマウントされたびに再検証されてしまいuseCartが発火していしまう
export function useCart(restaurantId?: string, enabled = true){
  // console.log("useCart。カート全件取得");

  const {
    data: carts,
    error: cartsError,
    isLoading,
    mutate: mutateCart, // mutate(callback, false) ... fetchされないし、GETも呼ばれない
                        //                             ローカルキャッシュだけが更新される
                        // mutate(callback)/mutate() ... fetchされる。GETが発火
                        // SWRはタブに戻った時やネット復帰したときなどにも自動で動く
  } = useSWR<CartType[]>(`/api/cart`, fetcher, { // Route Handlerを発火
    isPaused: () => !enabled, // ⭐️ trueでデータの再検証を一時停止
  }); 

  // ✅ 全てのカートの中から、今開いている店舗のデータを取得
  // カートをもっていない店舗ページもあるので、nullを返す
  const targetCart = restaurantId ? carts?.find((cart) => cart.restaurant_id === restaurantId) ?? null
                                  : null;
  // console.log(targetCart);
  // {id: 10, restaurant_id: 'ChIJZZPMQQDfAGARxEZtPATdWew', cart_items: Array(3), restaurantName: 'RAMEN JUNKEYZ', photoUrl: '/no-image.jpeg'}

  return { carts, cartsError, isLoading, mutateCart, targetCart }
}