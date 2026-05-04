
// オーダーに関するAPI
// /ordersページで履歴を管理する時に使う

import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { getPlaceDetails } from "../restaurants/api";
import { CartType, OrderType } from "@/types";

// ordersテーブル、order_itemsテーブルからデータを取得

export async function fetchOrders(): Promise<OrderType[]>{
  const supabase = await createClient();
  const bucket = supabase.storage.from("menus");

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if(!user || userError) {
    redirect("/");
  }

  const { data: orders, error: ordersError } = await supabase
  .from('orders')
  .select(`
    id,
    restaurant_id,
    created_at,
    fee,
    service,
    delivery,
    subtotal_price,
    total_price
  `).eq("user_id", user.id) // ordersテーブルのidと、ログインユーザーのidが一致
    .order("created_at"); // created_at が新しい順から

  // ✅ order_itemsテーブルはエラーで取得できない状態 ...
  // .select(`
  //   id,
  //   restaurant_id,
  //   created_at,
  //   fee,
  //   service,
  //   delivery,
  //   subtotal_price,
  //   total_price,
  //   order_items (
  //     id,
  //     price,
  //     quantity,
  //     name,
  //     image_path
  //   )
  // `).eq("user_id", user.id);

  if(ordersError) {
    console.error("注文履歴の取得に失敗しました。", ordersError);
    throw new Error("注文履歴の取得に失敗しました。");
  }

  // ordersに、店舗名、画像をつけて返す。
  const promises = orders.map(async (order): Promise<OrderType> => {
    const { data: restaurantData, error } = await getPlaceDetails(
      order.restaurant_id,
      ["displayName", "photos"],
    );

    if(!restaurantData || error) {
      // new Error(`レストランデータの取得に失敗しました。${error}`)
      console.error(`レストランデータの取得に失敗しました。${error}`);
    };

    return {
      ...order,
      // 👉 order_itemsはDBから取れないので消しておく
      // order_items: order.order_items.map((item) => {
      //   const { image_path, ...restMenus } = item;
      //   //     image_pathを除くことができる
      //   const publicUrl = bucket.getPublicUrl(image_path).data.publicUrl;

      //   return {
      //     ...restMenus,
      //     photoUrl: publicUrl,
      //   };
      // }),
      restaurantName: restaurantData?.displayName ?? "不明なお店",
      photoUrl: restaurantData?.photoUrl ?? "/no-image.jpeg",
    };
  });

  const results = await Promise.all(promises);

  return results;
}
