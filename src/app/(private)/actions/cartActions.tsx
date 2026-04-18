
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

// ✅ カートシートの時、select要素の数量を更新
export async function updateCartItemAction(
  quantity :number, // 数量
  cartItemId: number, // アイテム自体のid
  cartId: number // カート(店舗)のid
){
  // console.log(quantity, cartItemId, cartId); // 2 20 10

  const supabase = await createClient();
  const { 
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if(userError || !user) {
    redirect("/login");
  }

  // ✅ 削除の時の処理
  if(quantity === 0) { // 削除の時は0が渡ってくる
    // ✅ データなどは取得せず、件数のみ取得する
    const { count, error } = await supabase
      .from("cart_items")
      .select("*", { 
        count: "exact", // 厳密な
        head: true, // 
      }).eq("cart_id", cartId); 
      // → 今開いているカート(店舗)のidと一致するアイテムのcart_idを対象とする

    if(error) {
      console.error("カートの件数の取得に失敗しました。", error);
      throw new Error("カートの件数の取得に失敗しました。");
      // → console.errorはサーバー側で出力
      //   throwはフロント側でcatchされる
    }

    // ✅ アイテムが残り1つの時 → カート自体を削除
    if(count === 1) {
      const { error: deleteCartError } = await supabase
        .from("carts")
        .delete()
        .match({ user_id: user.id, id: cartId }); 
        // → ログインユーザー、カートのid

        if(deleteCartError) {
          console.error("カートの削除に失敗しました。", deleteCartError);
          throw new Error("カートの削除に失敗しました。");
        }
        return;
    }

    // ✅ カートの中にアイテムが複数の場合 → カート(店舗)の中のアイテム自体を削除するだけ
    const { error: deleteItemError } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId);

    if(deleteItemError) {
      console.error("カートアイテムの削除に失敗しました。", deleteItemError);
      throw new Error("カートの削除に失敗しました。")
    }
    return;
  }

  // ✅ 数量を更新する処理
  const { error: updateError } = await supabase
    .from("cart_items")
    .update({
      quantity: quantity,
    })
    .eq("id", cartItemId); // カートアイテムのidと、選択したカートのアイテムのidが一致するアイテム
  
  if(updateError) {
    console.error("カートアイテムの更新に失敗しました。", updateError);
    throw new Error("カートアイテムの更新に失敗しました。");
  }

}