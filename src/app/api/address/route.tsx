

// api/address/route.tsx

import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// なぜ try catch が必要か？
// Route Handler は普通の async 関数なので、下記のような理由で try-catch を使います。
// (1) エラーをハンドリングして、クライアントにわかりやすいレスポンスを返すため
// try なしだと、データベースやコードで例外が発生した瞬間に 自動的に 500 エラー が返るだけで、クライアント側は詳細が分かりません。
// try-catch を書くことで、どんなエラーかを制御して返すことができます。
// import { NextRequest, NextResponse } from "next/server";

// サーバーコンポーネントやサーバーアクションでエラーが投げられた場合、
// Next.js は ルート単位で自動的に error.tsx にフォールバックする。なのでtry catchはその意味で必要ない

// ✅ 住所の型。使うキーだけ型を定義する
type Address = {
  id: number;
  name: string;
  address_text: string;
  latitude: number;
  longitude: number;
}


export async function GET(request: NextRequest) {
  try {
    let addressList: Address[] = [];
    let selectedAddress: Address | null = null;

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if(userError || !user) {
      return NextResponse.json({ error: "ユーザー認証されていません。", status: 401 });
    } 

    // ✅ 住所情報をテーブルから取得
    const { 
      data: addressData, 
      error: addressError 
    } = await supabase.from("addresses")
        .select("id,name,address_text,latitude,longitude")
        .eq("user_id", user.id); // addressesテーブルのuser_idとログイン中のユーザーのidとが同じデータのみ取得

    if(addressError) {
      return NextResponse.json({ error: "住所の取得に失敗" }, { status: 500 });
    }

    addressList = addressData;


    // 現在選択中の住所情報を取得

    return NextResponse.json({ addressList, selectedAddress })
  } catch(error) {
    console.error(error);
    NextResponse.json({ error: "例外的なエラーが発生しました。" })
  }

}










