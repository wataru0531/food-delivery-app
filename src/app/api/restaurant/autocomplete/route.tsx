
// ✅ サジェスチョンを取得するためのAPI

import { type NextRequest, NextResponse  } from "next/server";


export async function GET(request: NextRequest) {
  // 👉 クエリパラメータを取得
  const searchParams = request.nextUrl.searchParams;
  // console.log(searchParams); 
  // URLSearchParams { 'input' => 'こんにちは', 'sessionToken' => '5a13872e-bf60-4628-8c23-c25fa69bad02' }
  const input = searchParams.get("input");
  const sessionToken = searchParams.get("sessionToken");

  if(!input) { // フロント側でもエラー対処はしているがバックエンドでも対処
    NextResponse.json({ error: "文字を入力してください" }, { status: 400 });
  }

  if(!sessionToken) {
    NextResponse.json({ error: "セッショントークンは必須です。" }, { status: 400 });
  }

  // ⭐️ APIを叩く
  try {
    const url = "https://places.googleapis.com/v1/places:autocomplete";

    const response = await fetch(url, {

    });

    if(!response.ok) {
      await errorData = await response.json();
      console.error(errorData);

      return { error: `リクエスト失敗: ${response.status}` };
    }


  } catch(error) {
    console.error(error);
    return NextResponse.json({ error: "予期せぬエラーが発生しました。" });
  }


  return NextResponse.json("success");
}






