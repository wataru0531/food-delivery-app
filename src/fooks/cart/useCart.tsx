
// カートに関するカスタムフック

import { CartType } from "@/types";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url);

  if(!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  const data = await response.json();
  return data;
}


// ✅ カートの中のデータを取得。
export function useCart(restaurantId?: string){
  const {
    data: carts,
    error: cartsError,
    isLoading,
    mutate: mutateCart,
  } = useSWR<CartType[]>(`/api/cart`, fetcher); // Route Handler

  // ✅ 全てのカートの中から、今開いている店舗のデータを取得
  // カートをもっていない店舗ページもあるので、nullを返す
  const targetCart = restaurantId ? carts?.find((cart) => cart.restaurant_id === restaurantId) ?? null
                                  : null;
  // console.log(targetCart);
  // {id: 10, restaurant_id: 'ChIJZZPMQQDfAGARxEZtPATdWew', cart_items: Array(3), restaurantName: 'RAMEN JUNKEYZ', photoUrl: '/no-image.jpeg'}

  return { carts, cartsError, isLoading, mutateCart, targetCart }
}