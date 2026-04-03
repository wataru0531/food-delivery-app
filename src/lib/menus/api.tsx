

// api.tsx
// → restaurant/[restaurant]/page.tsx で使用

import { CategoryMenusType, MenuType } from "@/types";
import { createClient } from "../supabase/server";

// ジャンル(ramen_restaurant) > さまざまなカテゴリーがあり、その中に「注目の商品」、「ラーメン」などがある
// → ここでは、ジャンルに見合ったカテゴリー並べ、そのカテゴリーに属するメニューを並べる

// ✅ 店舗の種別によりメニューを取得する
// → カテゴリーごとに分類したデータを返す
// menusテーブル
export async function fetchCategoryMenus(primaryType: string) {
  // console.log(primaryType); // ramen_restaurant

  const supabase = await createClient();
  const bucket = supabase.storage.from("menus"); // Supabaseのストレージのバケット(フォルダ)を指定

  const { data: menus, error: menusError } = await supabase
    .from("menus")
    .select("*")
    .eq("genre", primaryType);
  // console.log(menus); // (22) [{id: 56, name: '醤油ラーメン', price: 800, genre: 'ramen_restaurant', category: 'ラーメン', …}, {…}, {…}, {…}, {…}, {…}, {…}, ...]

  if(menusError) {
    console.error("メニューの取得に失敗しました。", menusError);
    return { error: "メニューの取得に失敗しました。" }
  }

  // 用意したデータベースにprimaryTypeが存在しない場合 = meunsがない場合
  if(menus.length === 0) return { data: [] }

  const categoryMenus: CategoryMenusType[] = []; // 

  // ✅ そのジャンル(ramen_restaurant)の中でも、「注目の商品」を取得 
  //    → is_featuredの値がtrueのアイテム
  const featuredItems = menus.filter(menu => menu.is_featured)
                          .map((menu): MenuType => ({
                            id: menu.id,
                            name: menu.name,
                            price: menu.price,
                            // ストレージのバケット名を指定して画像を取得
                            photoUrl: bucket.getPublicUrl(menu.image_path).data.publicUrl,
                          }));
  // console.log("featuredItems!!", featuredItems)
  
  categoryMenus.push({
    id: "featured",
    categoryName: "注目商品",
    items: featuredItems, // 注目の商品の配列
  });
  // console.log("categoryMenus!!", categoryMenus)

  // そのramen_restaurantのメニューを取得 ... menus
  // → ramen_restaurantの全てのカテゴリーを取得、重複を排除
  // → カテゴリー毎に分類したオブジェクトを配列で取得
  const array =  menus.map(menu => menu.category); // 重複した配列を取得
  // console.log(new Set(array)); // Set(3) { 'ラーメン', 'サイドメニュー', 'ドリンク' }
  const categories = Array.from(new Set(array)); // 👉 new Set ... 重複を排除して取得
                                                 //    Array.from ... 配列に戻す
  // console.log(categories); // [ 'ラーメン', 'サイドメニュー', 'ドリンク' ]

  for(const category of categories) {
    // console.log(console.log(menus.filter(menu => menu.category === category)))
    const items = menus.filter(menu => menu.category === category) // 取得したカテゴリーのみ取得
                      .map((menu): MenuType => ({ // データを整形
                        id: menu.id,
                        name: menu.name,
                        price: menu.price,
                        photoUrl: bucket.getPublicUrl(menu.image_path).data.publicUrl,
                      }));
    
    // ✅ 注目の商品を先頭にして、2つ目のインデックスからは、その他のカテゴリーに応じたデータにする
    categoryMenus.push({
      id: category,
      categoryName: category,
      items: items, // そのカテゴリーに属するメニューを取得
    })
  }
  // console.log("categoryMenus!!", categoryMenus);
  
  return { data: categoryMenus }
}
