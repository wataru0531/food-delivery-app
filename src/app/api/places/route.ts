
// ✅ レストランのデータを取得するAPI

// app/api/places/route.ts

export const revalidate = 86400; // 24時間キャッシュ（API自体をキャッシュ）

export async function GET() {
  const url = "https://places.googleapis.com/v1/places:searchNearby";
  const apiKey = process.env.GOOGLE_API_KEY;

  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey!,  // APIキー。undefinedの可能性はないので!をつける
    "X-Goog-FieldMask": "places.id,places.displayName,places.types,places.primaryType,places.photos" 
    // 欲しいフィールド(データ)を指定。空白は作らない
    // * → 全てを取得(api料金が高くなる)
  }

  // 指定した地点から、半径500メートルの範囲の10件のデータを取得する
  const requestBody = {
    includedPrimaryTypes: ["ramen-restaurant"], // 欲しい情報(プレイスタイプ)
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
    headers: header, // 通信のmeta情報(通信の説明)
    body: JSON.stringify(requestBody), // 実際の説明

    // cache: "force-cache", // デフォルト。可能ならキャッシュを使う。静的データ向き
                             // 一回データを取ったら使い回す 
    // cache: "no-store", // キャッシュを使わない
                          // 毎回必ず最新データを取得
                          // 完全にキャッシュしない
                          // 動的データ向き（ログイン、検索、ランキングなど）
    next: { revalidate: 86400 } // 24時間でキャッシュ。24時間後にキャッシュを再取得
  });

  const data = await response.json();
  // console.log(data); // {places: Array(10)}、
                    //  0: {id: 'ChIJWTGPjmaAhYARxz6l1hOj92w', types: Array(11), displayName: {…}, primaryType: 'historical_landmark', photos: Array(10)}
}