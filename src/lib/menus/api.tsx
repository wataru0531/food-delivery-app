

// api.tsx
// → restaurant/[restaurant]/page.tsx で使用

import { createClient } from "../supabase/server";


// ✅ 店舗の種別によりメニューを取得する
// menusテーブル
export async function fetchCategoryMenus(primaryType: string) {
  // console.log(primaryType); // ramen_restaurant

  const supabase = await createClient();

  const { data: menus, error: menusError } = await supabase
    .from("menus")
    .select("*")
    .eq("genre", primaryType);
  // console.log(menus);

  if(menusError) {
    console.error("メニューの取得に失敗しました。", menusError);
    return { error: "メニューの取得に失敗しました。" }
  }

  // 用意したデータベースにprimaryTypeが存在しない場合 = meunsがない場合
  if(menus.length === 0) return { data: [] }

  // console.log(menus); // (22) [{id: 56, name: '醤油ラーメン', price: 800, genre: 'ramen_restaurant', category: 'ラーメン', …}, {…}, {…}, {…}, {…}, {…}, {…}, ...]
}


// pnpm dlx supabase gen types typescript --project-id ndpohcdojjruiosbmyxz --schema public > database.types.ts