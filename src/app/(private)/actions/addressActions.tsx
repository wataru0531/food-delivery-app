
// 住所に関するサーバーアクション
"use server";

import { AddressSuggestionType } from "@/types";
import { getPlaceDetails } from "@/lib/restaurants/api";


export async function selectSuggestionAction(suggestion: AddressSuggestionType, sessionToken: string) {
  // console.log(suggestion); // { placeId: 'ChIJZZPMQQDfAGARxEZtPATdWew', placeName: 'RAMEN JUNKEYZ', address_text: '大阪府東大阪市七軒家１２−２７'}

  // ✅ 緯度、軽度を取得。Places Detail API呼び出し
  // 第2引数 ... フィールドを指定。X-Goog-FieldMaskの部分
  //            緯度、経度はlocationに入っている。他にも種類がある
  // 第3引数 ... 料金最適化のためのセッショントークン
  const { data: locationData, error } = await getPlaceDetails(suggestion.placeId, ["location"], sessionToken);
  // console.log(locationData); // { location: { latitude: 34.9894022, longitude: 135.766627 } }

  if(error || !locationData || !locationData.location || !locationData.location.latitude || !locationData.location.longitude) {
    throw new Error("住所情報を取得できませんでした。"); // 呼び出し元のtry catchに渡される。
  }

}


