
// カートに関するサーバーアクション

"use server"

import { getPlaceDetails } from "@/lib/restaurants/api";
import { createClient } from "@/lib/supabase/server";
import { CartType, MenuType } from "@/types";
import { redirect } from "next/navigation";

type addToCartActionResponse = | { type: string; cart: CartType;} 
                                | { type: string; id: number };


// ✅ カートに商品を追加する処理
export async function addToCartAction(
  selectedItem: MenuType, // 追加したい商品
  quantity: number,       // 個数
  restaurantId: string    // 店舗のID
): Promise<addToCartActionResponse> {
  // console.log(selectedItem, quantity, restaurantId);
  // { id: 56, name: '醤油ラーメン', price: 800, photoUrl: 'https://... '} 1 ChIJZZPMQQDfAGARxEZtPATdWew

  const supabase = await createClient();
  const bucket = supabase.storage.from("menus"); // 👉 Supabaseのストレージを取得
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
  
  // ✅ カートを新規作成 & アイテムを追加　... 既存のカートが存在しない場合
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

    // ✅ カートのデータを取得
    const { data: insertedCart, error: insertedCartError } = await supabase
      .from("carts")
      .select(`
        id,
        restaurant_id,
        cart_items (
          id,
          quantity,
          menus (
            id,
            name,
            price,
            image_path
          )
        )
      `,
      )
      .eq("user_id", user.id)
      .match({ user_id: user.id, id: newCart.id })
      .single();

      if(insertedCartError) {
        console.error("カートデータの取得に失敗しました。", insertedCartError);
        throw new Error(`カートデータの取得に失敗しました。${insertedCartError}`);
      }

      // ✅ 店舗データを取得
      const { data: restaurantData, error } = await getPlaceDetails(
        restaurantId,
        ["displayName", "photos"],
      );
      
      if(!restaurantData || error) new Error(`レストランデータの取得に失敗しました。${error}`);

      // ✅ カートデータに、店舗の名前と画像のデータを追加
      const updatedCart: CartType = {
        ...insertedCart,
        cart_items: insertedCart.cart_items.map((item) => {
          const { image_path, ...restMenus } = item.menus; // 👉 ...を使うことで残りのプロパティを受け取れる
          //     image_pathを除くことができる
          const publicUrl = bucket.getPublicUrl(image_path).data.publicUrl;

          return {
            ...item,
            menus: {
              ...restMenus,
              photoUrl: publicUrl,
            },
          };
        }),
        // → cart_itemsは、中のmenusのimage_pathをurlに編集して渡す
        restaurantName: restaurantData?.displayName,
        photoUrl: restaurantData?.photoUrl,
      };

    return { type: "new", cart: updatedCart };
  }

  // ✅ 既存のカートが存在する場合 →　そのアイテムの数量を更新
  // upsert → 更新か挿入かどちらか
  const { data, error: upsertError } = await supabase.from("cart_items").upsert({
    quantity: quantity,
    cart_id: existingCart.id,
    menu_id: selectedItem.id,
  }, { onConflict: "cart_id,menu_id" }) // cart_id と menu_idのペアでチェックする
  .select("id").single(); // 👉 1件分のidを取得
  //  cart_id と menu_idが同じなら、新たにレコードを挿入する
  //  → {cart_id: 1, menu_id: 10} このデータがすでにcart_itemsにあれば更新に切り替える

  if(upsertError) {
    console.error("カートアイテムの追加・更新に失敗しました。");
    throw new Error("カートの取得に失敗しました。");
  }

  return { type: "update", id: data.id };
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


// ✅ 注文を確定させる処理　CartSummary.tsx
export async function checkoutAction(cartId: number, fee: number, service: number, delivery: number) {
  // console.log(cartId);
  const supabase =  await createClient();

  // ① カートデータを取得 → carts、cart_items、menusのテーブル
  const { data: cart, error: cartsError } = await supabase
    .from("carts")
    .select(
      `
        id,
        restaurant_id,
        user_id,
        cart_items (
          id,
          quantity,
          menu_id,
          menus (
            id,
            name,
            price,
            image_path
          )
        )
      `,
    )
    .eq("id", cartId) // cartsテーブルの各idの中で、注文対象のカートのidと一致するデータを取得
    .single(); // 1件分のデータ

    // console.log(cart);
    // {
    //   id: 16,
    //   restaurant_id: 'ChIJZZPMQQDfAGARxEZtPATdWew',
    //   user_id: 'c20491c0-16c7-4ede-b73f-eb289a45fc97',
    //   cart_items: [
    //     { id: 45, menus: {id: 57, name: '味噌ラーメン', price: 850, image_path: 'ramen/miso-ramen.webp'}, quantity: 2 },
    //     { id: 44, menus: [Object], quantity: 3 }
    //   ]
    // }
  
  // エラー処理 → クライアントのtry catchで拾う。error.tsxはレンダリング中のエラーを拾う
  if(cartsError) {
    console.error("カートの取得に失敗しました。", cartsError);
    throw new Error("カートの取得に失敗しました。")
  }

  const { restaurant_id, user_id, cart_items } = cart;

  // カートのアイテムの小計を計算
  const subtotal = cart_items.reduce((accu, curr) => {
    // console.log(accu, curr);
    return accu + (curr.quantity * curr.menus.price);
  }, 0);

  const total = fee + service + delivery + subtotal; // 合計金額

  // ② ordersテーブルにデータ挿入
  const { error: orderError, data: order } = await supabase.from("orders").insert({
    restaurant_id: restaurant_id,
    user_id: user_id,
    fee: fee,
    service: service,
    delivery: delivery,
    subtotal_price: subtotal,
    total_price: total,
  }).select("id").single(); // 👉 ordersテーブルのidを取得 ... order_itemsテーブルに挿入時に使う
  // console.log(order); // { id: 10 }

  if(orderError) {
    console.error("注文の作成に失敗しました。");
    throw new Error("注文の作成に失敗しました。");
  }

  // ③ orders_itemsテーブルにデータ挿入
  //    cart_itemsテーブルを挿入するイメージ
  const orderItems = cart_items.map(item => {
    return { // 挿入するcart_itemsを作成
      quantity: item.quantity,
      order_id: order.id, // ordersテーブルのid
      menu_id: item.menu_id,
      price: item.menus.price,
      name: item.menus.name,
      image_path: item.menus.image_path,
    }
  });
  console.log(orderItems);

  const { error: ordersItemsError } = await supabase.from("orders_items").insert(orderItems)

  if(ordersItemsError) {
    console.error("order_itemsテーブルへのデータ挿入に失敗しました。", ordersItemsError);
    throw new Error("order_itemsテーブルへのデータ挿入に失敗しました。");
  }

  // ④ カートデータを削除
  const { error: cartDeleteError } = await supabase.from("carts")
    .delete()
    .eq("id", cartId); // cartsテーブルの中で、指定したカートのidとで一致したカートを1件削除

  if(cartDeleteError) {
    console.error("カートの削除に失敗しました。", cartDeleteError);
    throw new Error("カートの削除に失敗しました。");
  }
}



// pnpm dlx supabase gen types typescript --project-id ndpohcdojjruiosbmyxz --schema public > database.types.ts