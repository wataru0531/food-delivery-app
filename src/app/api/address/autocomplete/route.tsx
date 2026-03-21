
// ✅ モーダルで使うAPI
// → 住所を選択


import { type NextRequest, NextResponse  } from "next/server";
import { AddressSuggestionType, GooglePlacesAutoCompleteResponseType, RestaurantSuggestionType } from "@/types";


export async function GET(request: NextRequest) {
  // 👉 クエリパラメータを取得
  const searchParams = request.nextUrl.searchParams;
  // console.log(searchParams); 
  // URLSearchParams { 'input' => 'こんにちは', 'sessionToken' => '5a13872e-bf60-4628-8c23-c25fa69bad02' }
  const input = searchParams.get("input");
  const sessionToken = searchParams.get("sessionToken");

  if(!input) { // フロント側でもエラー対処はしているが、バックエンドでも対処
    return NextResponse.json({ error: "文字を入力してください" }, { status: 400 });
  }

  if(!sessionToken) {
    return NextResponse.json({ error: "セッショントークンは必須です。" }, { status: 400 });
  }

  // Route Handlerでは、try/catch文を使う
  try {
    const url = "https://places.googleapis.com/v1/places:autocomplete";

    const apikey = process.env.GOOGLE_API_KEY!;

    const header = {
      "Content-Type": "application/json",
      "X-Goog-Api-key": apikey,
    }

    const requestBody = {
      input: input, // 👉 ユーザーの入力文字
      sessionToken: sessionToken, // 👉 セッショントークン
      // includedPrimaryTypes: ["restaurant"],
      // includeQueryPredictions: true, // キーワードのサジェスチョンのデータも含める
                                     // →  サジェスチョン ... ユーザーが入力途中のときに表示される候補のこと
                                     // Google Places APIは2つの候補を返す
                                     // ① placePrediction（お店・場所の候補）
                                     // ② queryPrediction（検索キーワードの候補）
      locationBias: { // 検索を優先する場所。→ ただし絶対ではない
        circle: {
          center: {
            latitude: 34.9260799, // 京都市
            longitude: 135.708068
          }, 
          radius: 1000.0, // 1キロ圏を優先
        }
      },
      languageCode: "ja",
      // includedRegionCodes: ["jp"], // 検索対処の国。locationBiasと比べ、絶対条件となる
      regionCode: "jp", // 日本の情報を取得する確率が高くなる
    }

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: header,
      // next: { revalidate: 86400 }, // 24時間でキャッシュを更新
                                      // 👉 今回は入力のたびに新しいデータが欲しいので使わない
                                      // デフォルトでは、cache: "force-cache"。
                                      // だが、POSTの場合には基本キャッシュされない。
    });

    if(!response.ok) {
      const errorData = await response.json();
      console.error(errorData);

      return NextResponse.json({ error: `AutoCompleteリクエスト失敗: ${ response.status }`}, {  status: 500 });
    }

    const data: GooglePlacesAutoCompleteResponseType = await response.json();
    // console.log(data); // { suggestions: [ { placePrediction: [Object] }, { placePrediction: [Object] }, { placePrediction: [Object] }, ...] }, ... 
    // console.log(JSON.stringify(data, null, 2)); 

    const suggestions = data.suggestions ?? [];
    // console.log(suggestions);

    // ✅　データを整形
    const results = suggestions.map(suggestion => {
      // console.log(suggestion);
      return {
        placeId: suggestion.placePrediction?.placeId,
        placeName: suggestion.placePrediction?.structuredFormat?.mainText?.text,
        address_text: suggestion.placePrediction?.structuredFormat?.secondaryText?.text, // ⭐️ 住所を追加
      }
    })
    // .filter((suggestion): suggestion is AddressSuggestionType => suggestion.placeId !== undefined && suggestion.placeName !== undefined && suggestion.address_text);
    .filter((suggestion): suggestion is AddressSuggestionType => !!suggestion.placeId && !!suggestion.placeName && !!suggestion.address_text);
    // → 型ガード。placeId、placeName、address_textが必ずある状態で返す
    //           undefinedの可能性があるが、trueなら、TypeScriptにsuggestionはその型だと伝える

    // console.log(results); //[{ placeId: 'ChIJdfnUY5IPAWARH0gKwi4GYAM', placeName: '鳥せい本店', address_text: '京都府京都市伏見区上油掛町１８６' }, ... ]

    return NextResponse.json(results);

  } catch(error) { 
    console.error(error);
    return NextResponse.json({ error: "予期せぬエラーが発生しました。" });
  }
}











