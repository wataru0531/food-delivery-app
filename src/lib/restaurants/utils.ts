
import { CartItemType, PlaceSearchResult, RestaurantType } from "@/types";
import { getPhotoUrl } from "./api";


// ✅ 取得したデータを整形する関数
export async function transformPlaceResult(restaurants: PlaceSearchResult[]){
  // console.log(restaurants); 

  const promises = restaurants.map(async (restaurant): Promise<RestaurantType> => {
    // console.log(restaurant);

    return {
      id: restaurant.id,
      restaurantName: restaurant.displayName?.text,
      primaryType: restaurant.primaryType,
      // photosがない場合があるので
      // photoUrl: restaurant.photos?.[0]?.name ? await getPhotoUrl(restaurant.photos[0].name)
      //                                       : "no-image.jpeg",
      photoUrl: "/no-image.jpeg", // 👉 "use cache"が開発段階なので基本的にはこちらを使うようにする

    }
  });

  const data = await Promise.all(promises);

  return data;
}

// ✅ カートアイテムの合計金額を計算
export function calculateItemTotal(item: CartItemType) {
  // console.log(item);
  // {id: 10, restaurant_id: 'ChIJZZPMQQDfAGARxEZtPATdWew', cart_items: [ {id: 19, menus: {id: 56, name: '醤油ラーメン', price: 800, photoUrl: 'https://ndpohcdojjruiosbmyxz.supabase.co/storage/v1/object/public/menus/ramen/shoyu-ramen.webp'}, quantity: 3}], restaurantName: 'RAMEN JUNKEYZ', photoUrl: '/no-image.jpeg'}
  return item.quantity * item.menus.price;
}

// ✅ カートアイテムの小計を算出
export function calculateSubTotal(cartItems: CartItemType[]) {
  // console.log(items); // (3) [{id: 19, menus: {id: 56, name: '醤油ラーメン', price: 800, photoUrl: 'https://ndpohcdojjruiosbmyxz.supabase.co/storage/v1/object/public/menus/ramen/shoyu-ramen.webp'}, quantity: 3}, {…}, {…}]

  return cartItems.reduce((accu, curr) => {
    // console.log(accu, curr)
    return accu + calculateItemTotal(curr); // ✅　カートのアイテムの合計金額を計算
  }, 0)
}