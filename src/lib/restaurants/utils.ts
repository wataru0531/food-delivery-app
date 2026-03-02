


import { PlaceSearchResult } from "@/types";


// ✅ 取得したデータを整形する関数
export async function transformPlaceResult(restaurants: PlaceSearchResult[]){
  // console.log(restaurants); // [
                                // {
                                //   id: 'ChIJ58ZWi1IEAWARVLLkq8lYNj4',
                                //   types: [
                                //     'ramen_restaurant',
                                //     'japanese_restaurant',
                                //     'restaurant',
                                //     'food',
                                //     'point_of_interest',
                                //     'establishment'
                                //   ],
                                //   displayName: { text: 'RA－MEN 赤影', languageCode: 'ja' },
                                //   primaryType: 'ramen_restaurant',
                                //   photos: [
                                //     [Object], [Object],
                                //     [Object], [Object],
                                //     [Object], [Object],
                                //     [Object], [Object],
                                //     [Object], [Object]
                                //   ]
                                // },
                                // { ... }
  const promises = restaurants.map(async (restaurant) => {
    return {
      id: restaurant.id,
      restaurantName: restaurant.displayName?.text,
      primaryType: restaurant.primaryType,
      // レストランの名前がない場合があるので
      photoUrl: restaurant.photos?.[0]?.name ? await getPhotoUrl(restaurant.photos[0].name)
                                            : "no-image.jpeg",

    }
  });

  const data = await Promise.all(promises);

}

// ⭐️ここからここから⭐️ここからここから⭐️ここからここから⭐️ここからここから
// ⭐️ここからここから⭐️ここからここから⭐️ここからここから⭐️ここからここから⭐️ここからここから
// ✅ Photosのurlを配列に加工して取得
async function getPhotoUrl(name: string){

}