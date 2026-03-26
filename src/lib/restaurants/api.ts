
// ✅ レストランに関するAPI 
// → ⭐️ キャッシュがPOSTでは効かないので、app/api/places/route.ts に記述

import { GooglePlacesDetailsApiResponseType, GooglePlacesSearchApiResponse, PlaceDetailsAll } from "@/types";
import { transformPlaceResult } from "./utils";
import { createClient } from "../supabase/server";
import { redirect } from "next/navigation";
import { convertServerPatchToFullTree } from "next/dist/client/components/segment-cache/navigation";


// ✅ 近くのラーメン店を取得
export async function fetchRamenRestaurants(){
  const url = "https://places.googleapis.com/v1/places:searchNearby";
  const apiKey = process.env.GOOGLE_API_KEY;

  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey!,  // APIキー。undefinedの可能性はないので!をつける
    "X-Goog-FieldMask": "places.id,places.displayName,places.primaryType,places.photos" 
    // 欲しいフィールド(データ)を指定。空白は作らない
    // * → 全てを取得(api料金が高くなる)
  }

  // 指定した地点から、半径500メートルの範囲の10件のデータを取得する
  const requestBody = {
    includedPrimaryTypes: ["ramen_restaurant"], // 欲しい情報(プレイスタイプ)
                                           // https://developers.google.com/maps/documentation/places/web-service/place-types?hl=ja&_gl=1*15zugjc*_up*MQ..*_ga*MTMwMDQ2NTUxMC4xNzcyMTgxMzk0*_ga_SM8HXJ53K2*czE3NzIxODEzOTMkbzEkZzAkdDE3NzIxODEzOTMkajYwJGwwJGgw*_ga_NRWSTWS78N*czE3NzIxODY1MTAkbzIkZzEkdDE3NzIxODY1NDAkajMwJGwwJGgw
    maxResultCount: 10, // 取得するデータの件数
    locationRestriction: { // 取得するデータの地点
      circle: {
        center: {
          latitude: 34.9260799, // 緯度 ... Googleマップから取得可能
          longitude: 135.708068
        }, // 経度
        radius: 1000.0, // 半径.500メートルを指定
      },
    },
    languageCode: "ja",
    rankPreference: "DISTANCE" // 距離の近い順に取得。デフォルトは人気順(POPULARITY)
  }

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(requestBody), // 実際の説明
    headers: header, // 通信のmeta情報(通信の説明)
    
    // cache: "force-cache", // デフォルト。可能ならキャッシュを使う。静的データ向き
                             // 一回データを取ったら使い回す 
    // cache: "no-store", // キャッシュを使わない
                          // 毎回必ず最新データを取得
                          // 完全にキャッシュしない
                          // 動的データ向き（ログイン、検索、ランキングなど）
    next: { revalidate: 86400 } // 24時間でキャッシュ。24時間後にキャッシュを再取得
  });

  if(!response.ok) {
    const errorData = await response.json();
    console.error(errorData);
    return { error: `NearbySearchリクエスト失敗 : ${response.status}` }
  }
  
  const data: GooglePlacesSearchApiResponse = await response.json(); // JSオブジェクトに変換
  // console.log(data); // {places: Array(10)}、
                    //  0: {
                    //      id: 'ChIJWTGPjmaAhYARxz6l1hOj92w', 
                    //      types: (6) ['ramen_restaurant', 'japanese_restaurant', 'restaurant', 'food', 'point_of_interest', 'establishment'], 
                    //      displayName: {text: 'RA－MEN 赤影', languageCode: 'ja'}
                    //      primaryType: 'historical_landmark', 
                    //      photos : (10) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
                    //      primaryType :  "ramen_restaurant"
                    //  1: ...

  if(!data.places){ // お店がなくて空オブジェクトが帰ってきた場合
    return { data: [] };
  }

  const nearbyRamenPlaces = data.places;

  const ramenRestaurants = await transformPlaceResult(nearbyRamenPlaces); // 取得したデータを扱いやすいように整形
  // console.log(ramenRestaurants);
  // (2) [{id: 'ChIJ58ZWi1IEAWARVLLkq8lYNj4', restaurantName: 'RA－MEN 赤影', primaryType: 'ramen_restaurant', photoUrl: 'https://places.googleapis.com/v1/places/ChIJ58ZWi1…yBa8qlrcwFyauWD-CE8Uopl7FsQP0oSjvI&maxWidthPx=400'}, {…}, _debugInfo: Array(1)]

  return { data: ramenRestaurants };
}


// ✅ Photosの画像urlを配列に加工して取得
// → 画像1枚に対し1円かかる、それを一度に10枚取得するので1度のリクエストで10円かかってしまう。
//   キャッシュを利生して金がかからないようにする。
export async function getPhotoUrl(name: string, maxWidth = 400){
  "use cache"; // 👉 これより以下のコードがキャッシュされるのではなく、実行結果がキャッシュされる
               //    関数の中身が実行されるというよりも、保存されたreturnの値がそのまま返される。 
  // console.log("use cache!"); // Cache  use cache!

  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://places.googleapis.com/v1/${name}/media?key=${apiKey}&maxWidthPx=${maxWidth}`

  return url;
}


// ✅ 近くのレストランを取得
export async function fetchRestaurants(){
  const url = "https://places.googleapis.com/v1/places:searchNearby";
  const apiKey = process.env.GOOGLE_API_KEY;

  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey!,  
    "X-Goog-FieldMask": "places.id,places.displayName,places.types,places.primaryType,places.photos" 
  }

  const desiredTypes = [ // 取得したいレストランの種別
    "japanese_restaurant",
    "cafe",
    "cafeteria",
    "coffee_shop",
    "chinese_restaurant",
    "fast_food_restaurant",
    "hamburger_restaurant",
    "french_restaurant",
    "italian_restaurant",
    "pizza_restaurant",
    "ramen_restaurant",
    "sushi_restaurant",
    "korean_restaurant",
    "indian_restaurant",
  ];

  const requestBody = {
    // includedPrimaryTypes: ["ramen_restaurant"], // 5件までしか不可
    includedTypes: desiredTypes, // 50件ほどは取得できる
    maxResultCount: 10,
    locationRestriction: {
      circle: {
        center: {
          latitude: 34.9260799,
          longitude: 135.708068
        },
        radius: 1000.0,
      },
    },
    languageCode: "ja",
    rankPreference: "DISTANCE",
  }

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: header,
    
    // cache: "force-cache", // デフォルト。可能ならキャッシュを使う。静的データ向き
                             // 一回データを取ったら使い回す 
    // cache: "no-store", // キャッシュを使わない
                          // 毎回必ず最新データを取得
                          // 完全にキャッシュしない
                          // 動的データ向き（ログイン、検索、ランキングなど）
    next: { revalidate: 86400 } // 24時間でキャッシュ。24時間後にキャッシュを再取得
  });

  if(!response.ok) {
    const errorData = await response.json();
    console.error(errorData);
    return { error: `NearbySearchリクエスト失敗 : ${response.status}` }
  }

  const data: GooglePlacesSearchApiResponse = await response.json(); // JSオブジェクトに変換

  if(!data.places){
    return { data: [] };
  }

  const nearbyPlaces = data.places;
  // console.log("nearbyPlaces", nearbyPlaces);

  // ✅ 指定した種別のみを取得する
  //    取得したレストランのprimaryTypeと、指定した種別が合致したもののみを取得
  const matchingPlaces = nearbyPlaces.filter(place => place.primaryType && desiredTypes.includes(place.primaryType));
  // console.log("matchingPlaces", matchingPlaces); // → 取得したデータの件数が減るが欲しいデータのみを取得

  const ramenRestaurants = await transformPlaceResult(matchingPlaces);

  return { data: ramenRestaurants };
}


// ✅ カテゴリ検索
export async function fetchCategoryRestaurants(categoryType: string){
  const url = "https://places.googleapis.com/v1/places:searchNearby";
  const apiKey = process.env.GOOGLE_API_KEY;

  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey!,
    "X-Goog-FieldMask": "places.id,places.displayName,places.primaryType,places.photos" 
  }

  const requestBody = {
    includedPrimaryTypes: [categoryType], // 👉 ここで欲しいカテゴリーのタイプを指定
    maxResultCount: 10, 
    locationRestriction: { 
      circle: {
        center: {
          latitude: 34.9260799,
          longitude: 135.708068
        }, 
        radius: 1000.0,
      },
    },
    languageCode: "ja",
    rankPreference: "DISTANCE" 
  }

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(requestBody), // 実際の説明
    headers: header, // 通信のmeta情報(通信の説明)
    
    // cache: "force-cache", // デフォルト。可能ならキャッシュを使う。静的データ向き
                             // 一回データを取ったら使い回す 
    // cache: "no-store", // キャッシュを使わない
                          // 毎回必ず最新データを取得
                          // 完全にキャッシュしない
                          // 動的データ向き（ログイン、検索、ランキングなど）
    next: { revalidate: 86400 } // 24時間でキャッシュ。24時間後にキャッシュを再取得
  });

  if(!response.ok) {
    const errorData = await response.json();
    console.error(errorData);
    return { error: `NearbySearchリクエスト失敗 : ${response.status}` }
  }
  
  const data: GooglePlacesSearchApiResponse = await response.json();

  if(!data.places){
    return { data: [] };
  }

  const categoryPlaces = data.places;

  const categoryRestaurants = await transformPlaceResult(categoryPlaces); // 取得したデータを扱いやすいように整形

  return { data: categoryRestaurants };
}


// ✅ キーワード検索でのAPI
export async function fetchRestaurantsByKeyword(query: string){
  const url = "https://places.googleapis.com/v1/places:searchText";
  const apiKey = process.env.GOOGLE_API_KEY;

  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey!,
    "X-Goog-FieldMask": "places.id,places.displayName,places.primaryType,places.photos" 
  }

  const requestBody = {
    textQuery: query, // 👉 ここで欲しいカテゴリーのタイプを指定
    // maxResultCount: 10, // 非推奨 
    pageSize: 10, // デフォルトは20件
    locationBias: { // 指定したエリア外も取得する
      circle: {
        center: {
          latitude: 34.9260799,
          longitude: 135.708068
        }, 
        radius: 1000.0,
      },
    },
    languageCode: "ja",
    rankPreference: "DISTANCE" 
  }

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(requestBody), // 実際の説明
    headers: header, // 通信のmeta情報(通信の説明)

    next: { revalidate: 86400 } // 24時間でキャッシュ。24時間後にキャッシュを再取得
  });

  if(!response.ok) {
    const errorData = await response.json();
    console.error(errorData);
    return { error: `TextSearchリクエスト失敗 : ${response.status}` }
  }
  
  const data: GooglePlacesSearchApiResponse = await response.json();

  if(!data.places){
    return { data: [] };
  }

  const textSearchPlaces = data.places;

  const restaurants = await transformPlaceResult(textSearchPlaces); // 取得したデータを扱いやすいように整形

  return { data: restaurants };
}


// ✅ 緯度、経度のデータなどの詳細データを取得。
//    サーバーアクションで実行。addressAction.tsx
export async function getPlaceDetails(placeId: string, fields: string[], sessionToken?: string) {
  // console.log(placeId); // ChIJ8d6LEEoEAWARx_vjxLWiis4
  // console.log(fields); // [ 'location' ]

  const fieldsParam = fields.join(",");
  // console.log(fieldsParam); // location

  let url: string; // APIエンドポイント

  // Places Detail APIを呼び出した時に、料金の最適化をする場合としない場合とであるので条件分岐
  if(sessionToken) {
    url = `https://places.googleapis.com/v1/places/${placeId}?sessionToken=${sessionToken}&languageCode=ja`;
    // → sessionToken、languageCodeなどは、Google側で処理される。APIの仕様
  } else {
    // 料金を最適化できない場合はsessionTokenを含めないだけ
    url = `https://places.googleapis.com/v1/places/${placeId}?languageCode=ja`;
  }

  const apiKey = process.env.GOOGLE_API_KEY;

  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey!,
    "X-Goog-FieldMask": fieldsParam,
  }

  const response = await fetch(url, {
    method: "GET",
    // body: JSON.stringify(requestBody), // GETの時にはbodyの指定はできない
    headers: header, // 通信のmeta情報(通信の説明)
    next: { revalidate: 86400 } // 24時間でキャッシュ。24時間後にキャッシュを再取得
  });
  // console.log(response);

  if(!response.ok) {
    const errorData = await response.json();
    console.error(errorData);
    return { error: `PlaceDetailsリクエスト失敗 : ${response.status}` }
  }
  
  // json() → Response の body を文字列として読み取り、JSONとしてパースして JS オブジェクトに変換する
  //          json()の内部で、response.text()、JSON.parse()が実行されていてる。
  const data: GooglePlacesDetailsApiResponseType = await response.json();
  // console.log(data); // { location: { latitude: 34.6882322, longitude: 135.5892084 } }
  
  const results: PlaceDetailsAll = {};

  // locationが指定されてある場合 → API呼び出しで異なるので条件分岐
  if(fields.includes("location") && data.location) { // 引数、レスポンスにlocationがあるかどうか
    results.location = data.location;
  }
  // console.log(results); // { location: { latitude: 34.6882322, longitude: 135.5892084 } }

  return { data: results }
}

// ✅ 緯度、経度のデータを取得
// 👉 profilesテーブルのselected_address_idに紐づいている、
//   addressesテーブルのidと一致する住所の緯度、経度を取得する
export async function fetchLocation(){
  const DEFAULT_LOCATION = { lat: 34.9260799, lng: 135.708068 } // 初期の緯度、経度。ユーザーが何も指定していないときのデータ

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if(userError || !user) {
    redirect("/login");  
  }

  // 選択中の住所の緯度と経度を取得
  // profilesテーブルのselected_address_idと、addressesテーブルのidとが紐づいている
  const { data: selectedAddress, error: selectedAddressError }
    = await supabase.from("profiles")
            .select(`addresses(latitude,longitude)`) // addressesテーブルから欲しいカラムを記述
            .eq("id", user.id) // どのレコードからデータを取得するか。
                                // profilesテーブルのidと、ログイン中のユーザーのid
            .single(); // 選択中の住所は1件なので
  
  if(selectedAddressError) {
    console.error("緯度と経度の取得に失敗しました。", selectedAddressError);
    throw new Error("緯度と経度の取得に失敗しました。");
    // → errorオブジェクトを返すのではなくて、ここでは例外をなげてerror.tsxに捕まえさせる。
  }

  const lat = selectedAddress.addresses?.latitude ?? DEFAULT_LOCATION.lat;
  const lng = selectedAddress.addresses?.longitude ?? DEFAULT_LOCATION.lng;

  return { lat, lng };
}