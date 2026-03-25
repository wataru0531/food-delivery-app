
// 住所に関するサーバーアクション
"use server";

import { AddressSuggestionType, AddressType } from "@/types";
import { getPlaceDetails } from "@/lib/restaurants/api";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";


// ✅ 選択したサジェスチョンをデータベースに保存 → Profilesテーブルを更新
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

  // ⭐️ データベースに接続
  const supabase = await createClient(); // サーバー用のクライアント
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  // console.log(user);
  if(!user || userError) redirect("/login"); // ログインしている状態だが一応書いておく

  // ✅ 住所情報をデータベースに保存 addressesテーブルに保存
  const { data: newAddress, error: insertError } = await supabase.from("addresses").insert({
    name: suggestion.placeName,
    address_text: suggestion.address_text,
    latitude: locationData.location.latitude, // 緯度
    longitude: locationData.location.longitude, // 経度
    user_id: user.id,
  })
  .select("id").single(); // 👉 今選択したサジェスチョンのidを、Profilesに保存するときのidとして使う。1件分を取得
  // console.log(newAddress); // { id: 3 }

  if(insertError) {
    console.error("住所の保存に失敗しました。", insertError); // サーバー側で表示される
    throw new Error("住所の保存に失敗しました。"); // → 呼び出し元のtry/catchで捕まえられる
                                              //    console.error(e) で表示される。クラインと側で表示
  }

  // ✅ Profilesテーブルを更新 
  //   addressesテーブルに保存したと同時に、selected_address_idにaddressesテーブルのidを付与
  // → ログインして新規登録した時点でProfilesのuuidがセットされているが、selected_address_idがnullのまま
  const { data: updateData, error: updateError } = await supabase.from("profiles").update({
    selected_address_id: newAddress.id,
  })
  .eq("id", user.id); // 👉 更新するレコードを指定。
                      // profilesテーブルのidカラムの値が、user.id(ログイン中のユーザー)と等しいレコードだけを対象にする
  // console.log(updateData); // null 

  if(updateError) {
    console.error("プロフィールの更新に失敗しました。", updateError);
    throw new Error("プロフィールの更新に失敗しました。");
  }
}



// ✅ 現在選択中のサジェスチョンを更新する処理

export async function selectAddressAction(address: AddressType) {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();


}