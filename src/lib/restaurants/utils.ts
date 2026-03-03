
import { PlaceSearchResult, RestaurantType } from "@/types";
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