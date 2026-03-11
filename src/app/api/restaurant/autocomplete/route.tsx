
// ✅ サジェスチョンを取得するためのAPI

import { type NextRequest, NextResponse  } from "next/server";


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

  // ⭐️ APIを叩く
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
      includedPrimaryTypes: ["restaurant"],
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
      includedRegionCodes: ["jp"], // 検索対処の国。locationBiasと比べ、絶対条件となる
    }

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: header,
      next: { revalidate: 86400 }, // 24時間でキャッシュを更新
    });

    if(!response.ok) {
      const errorData = await response.json();
      console.error(errorData);

      return { error: `リクエスト失敗: ${response.status}` };
    }

    const data = await response.json();
    // console.log(data); // { suggestions: [ { placePrediction: [Object] }, { placePrediction: [Object] }, { placePrediction: [Object] }, ...] }, ... 
    // console.log(JSON.stringify(data, null, 2)); 
    // [{ placePrediction: { "place": "places/ChIJZZPMQQDfAGARxEZtPATdWew", "placeId": "ChIJZZPMQQDfAGARxEZtPATdWew",  "text": { "日本、大阪府東大阪市七軒家１２−２７ RAMEN JUNKEYZ", ...} },... }

  } catch(error) {
    console.error(error);
    return NextResponse.json({ error: "予期せぬエラーが発生しました。" });
  }

  return NextResponse.json("success");
}






