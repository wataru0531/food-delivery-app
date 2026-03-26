

// api/address/route.tsx

import { createClient } from "@/lib/supabase/server";
import { AddressType } from "@/types";
import { NextRequest, NextResponse } from "next/server";

// なぜ try catch が必要か？
// Route Handler は普通の async 関数なので、下記のような理由で try-catch を使います。
// (1) エラーをハンドリングして、クライアントにわかりやすいレスポンスを返すため
// try なしだと、データベースやコードで例外が発生した瞬間に 自動的に 500 エラー が返るだけで、クライアント側は詳細が分かりません。
// try-catch を書くことで、どんなエラーかを制御して返すことができます。
// import { NextRequest, NextResponse } from "next/server";

// サーバーコンポーネントやサーバーアクションでエラーが投げられた場合、
// Next.js は ルート単位で自動的に error.tsx にフォールバックする。なのでtry catchはその意味で必要ない


// ✅ ログイン中のユーザーに紐づく住所、現在選択中の住所を取得
export async function GET(request: NextRequest) {
  try {
    let addressList: AddressType[] = [];
    let selectedAddress: AddressType | null = null;

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser(); // ログイン中ユーザー情報を取得

    if(userError || !user) {
      return NextResponse.json({ error: "ユーザー認証されていません。", status: 401 });
    } 

    // ✅ ログイン中のユーザーに紐づく住所情報をテーブルから取得
    const { data: addressData, error: addressError } = await supabase.from("addresses")
      .select("id,name,address_text,latitude,longitude")
      .eq("user_id", user.id); // addressesテーブルのuser_idと、ログイン中のユーザーのidとが同じデータのみ取得

    if(addressError) {
      console.error("プロフィール情報の取得に失敗しました。", addressError);
      return NextResponse.json({ error: "住所の取得に失敗" }, { status: 500 });
    }

    addressList = addressData;

    // ✅ 現在選択中の住所情報を取得
    // → Profilesテーブルのselected_address_idと、それに紐づくaddressesテーブルのデータを取得する
    //   Profilesのselected_address_id と addressesのid で外部キーが貼られているので、自動でJOINしてくれる
    const { data: selectedAddressData, error: selectedDataError } = await supabase.from("profiles")
    .select("addresses(id,name,address_text,latitude,longitude)")
    .eq("id", user.id)
    .single();

    if(selectedDataError) {
      console.error("プロフィール情報の取得に失敗しました。", selectedDataError);
      return NextResponse.json({ error: "プロフィール情報の取得に失敗しました。" }, { status: 500 });
    }

    selectedAddress = selectedAddressData.addresses;

    // console.log("addressList!!", addressList); // [{ id: 12, name: 'RAMEN JUNKEYZ', address_text: '大阪府東大阪市七軒家１２−２７', latitude: 34.6882322, longitude: 135.5892084}, { ... }]
    // console.log("selectedAddressData!!", selectedAddressData.addresses); // { id: 13, name: 'RAMEN KATAMUKI（ラーメン カタムキ）Chicken & Vegan noodles shop', latitude: 34.9894022, longitude: 135.766627, address_text: '京都府京都市下京区稲荷町４４８' }

    return NextResponse.json({ addressList, selectedAddress })
  } catch(error) {
    console.error(error);
    NextResponse.json({ error: "例外的なエラーが発生しました。" })
  }
}










