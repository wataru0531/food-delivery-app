
// api/cart/route.tsx


import { getPlaceDetails } from "@/lib/restaurants/api";
import { createClient } from "@/lib/supabase/server";
import { CartType } from "@/types";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    const bucket = supabase.storage.from("menus"); // 👉 Supabaseのストレージ名を取得

    if(userError || !user) {
      return NextResponse.json({ error: "ユーザーが認証されていません。" }, { status: 401 });
    }

    // cartsテーブルの id, restaurantId, 
    // そのidに紐づく cart_itemsテーブルから id, quantity
    // その menu_id に紐づく menuテーブルからid, name, price, image_path を取得
    const { data: carts, error: cartsError } = await supabase.from("carts").select(`
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
    `).eq("user_id", user.id); // 👉 cartsテーブルのどのレコードを取得するのか。
                              //     → ユーザーが持っているデータを全て取得
    
    if(cartsError) {
      console.error("カートデータを取得できませんでした。", cartsError);
      return NextResponse.json({ error: "カートデータを取得できませんでした。" }, { status: 500 });
    }

    // console.log("cartsです。", carts);
    //  [{ id: 1, restaurant_id: 'ChIJZZPMQQDfAGARxEZtPATdWew', cart_items: [ [Object], [Object] ]}]

    const promises = carts.map(async (cart):Promise<CartType> => {
      const { data: restaurantData, error } = await getPlaceDetails(cart.restaurant_id, ["displayName","photos"]);
      
      if(!restaurantData || error) new Error(`レストランデータの取得に失敗しました。${error}`);

      return { // Promiseオブジェクトで返る
        ...cart,
        cart_items: cart.cart_items.map(item => {
          const { image_path, ...restMenus } = item.menus; // 👉 ...を使うことで残りのプロパティを受け取れる
                                                          //     image_pathを除くことができる 
          const publicUrl = bucket.getPublicUrl(image_path).data.publicUrl;

          return {
            ...item,
            menus: {
              ...restMenus,
              photoUrl: publicUrl,
            }
          }
        }),
        // → cart_itemsは、中のmenusのimage_pathをurlに編集して渡す
        restaurantName: restaurantData?.displayName,
        photoUrl: restaurantData?.photoUrl,
      }
    });

    const results = await Promise.all(promises);

    return NextResponse.json(results);
  } catch(error) {
    console.error("予期せぬエラーが起きました。", error);
    return NextResponse.json({ error: "予期せぬエラーが起きました。" }, { status: 500 });
  }
}
