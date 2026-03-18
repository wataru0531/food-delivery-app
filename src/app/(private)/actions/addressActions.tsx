
// 住所に関するサーバーアクション
"use server";

import { getPlaceDetails } from "@/lib/restaurants/api";
import { AddressSuggestionType } from "@/types";

export async function selectSuggestionAction(suggestion: AddressSuggestionType, sessionToken: string) {
  // console.log(suggestion); // { placeId: 'ChIJZZPMQQDfAGARxEZtPATdWew', placeName: 'RAMEN JUNKEYZ', address_text: '大阪府東大阪市七軒家１２−２７'}

  // ✅ PlaceDetail API呼び出し ... 他でも使うのでapiフォルダで定義
  // 緯度、軽度を取得する
  // 第2引数 ... フィールドを指定。X-Goog-FieldMaskの部分
  //            緯度、経度はlocationに入っているのでここで指定
  // 第3引数 ... 料金最適化のためのセッショントークン
  await getPlaceDetails(suggestion.placeId, ["location"], sessionToken);

}


