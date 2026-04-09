
// カートに関するサーバーアクション

"use server"

import { createClient } from "@/lib/supabase/server";
import { MenuType } from "@/types";
import { redirect } from "next/navigation";


// ✅ カートに商品を追加する処理
export async function addToCartAction(
  selectedItem: MenuType, // 追加したい商品
  quantity: number,       // 個数
  restaurantId: string    // 店舗のID
) {
  // console.log(selectedItem, quantity, restaurantId);
  // { id: 56, name: '醤油ラーメン', price: 800, photoUrl: 'https://... '} 1 ChIJZZPMQQDfAGARxEZtPATdWew

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if(userError || !user) {
    redirect("/login");
  }

  // カートの存在チェック
  const { 
    data: existingCart, 
    error:existingError  
  } = await supabase
    .from("carts")
    .select("id")
    .match({ user_id: user.id, restaurant_id: restaurantId })
    // → ログインユーザーと一致 かつ　店舗IDとURLとが一致
    .maybeSingle(); // 0件だとnullでエラーが出ない。singleだとエラーが出る
  
  if(existingError) {
    console.error("カートの取得に失敗しました。", existingError);
    throw new Error("カートの取得に失敗しました。");
  }
  
  // ✅ 既存のカートが存在しない場合、カートを新規作成 & アイテムを追加
  if(!existingCart) {
    // ⭐️ cartsテーブルにレコードを挿入
    const { data: newCart, error: newCartError } = await supabase.from("carts").insert({
      restaurant_id: restaurantId, // ChIJZZPMQQDfAGARxEZtPATdWew
      user_id: user.id, // ログインユーザーのid
    })
    .select("id").single();

    if(newCartError) {
      console.error("カートの作成に失敗しました。", newCartError);
      throw new Error("カートの作成に失敗しました。");
    }

    // ⭐️ cart_itemsテーブルにレコードを挿入
    const { error: insertError } = await supabase.from("cart_items").insert({
      quantity: quantity,
      cart_id: newCart.id, // 👉 
      menu_id: selectedItem.id,
    });

    if(insertError) {
      console.error("カートアイテムの追加に失敗しました。", insertError);
      throw new Error("カートアイテムの追加に失敗しました。");
    }

    return;
  }

  // ✅ 既存のカートが存在する場合 →　そのアイテムの数量を更新
  // upsert → 更新か挿入かどちらか
  const { error: upsertError } = await supabase.from("cart_items").upsert({
    quantity: quantity,
    cart_id: existingCart.id,
    menu_id: selectedItem.id,
  }, { onConflict: "cart_id,menu_id" }); // cart_id と menu_idのペアでチェックする
  //  cart_id と menu_idが同じなら、新たにレコードを挿入する
  //  → {cart_id: 1, menu_id: 10} このデータがすでにcart_itemsにあれば更新に切り替える

  if(upsertError) {
    console.error("カートアイテムの追加・更新に失敗しました。");
    throw new Error("カートの取得に失敗しました。");
  }



}
