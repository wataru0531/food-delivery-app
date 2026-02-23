
"use server";

// ✅ サーバーアクション
// APIを書かなくてもいい → APIルートを書かなくてもいい。
//                      これまでは、/api/login/route.ts など、自分で作る必要があった
// 型安全 → jsonの変換をしなくていい
// 自動でサーバー実行 → "use server" と書くだけ
// フロントとサーバーとの境界が消えた

// 👉 通常の通信処理
// UI → fetch → API → DB → JSON → UI更新
// データを送って → データを受け取って → 自分で画面を更新する

// 👉 サーバーアクション
// UI(form / button) → Server Action 発火 → DB操作 → 自動で再レンダリング → UI更新
// サーバーに任せたら、新しい画面がそのまま返ってくる

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server";


// ✅ ログイン
export async function login() {
  // Googleログイン
  // console.log("Google Login");
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google", // Googleでログインするので
    options: {
      redirectTo: 'http://localhost:3000/auth/callback', // → 認証が済んだ時のリダイレクト先
                                                         //   callback.tsのGETを発火 
    },
  });

  if(error) console.error(error);

  if(data.url) {
    redirect(data.url) // use the redirect API for your server framework
  }

}


// ✅ ログアウト
export async function logout(){
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signOut();
  if(error) console.error(error);

  redirect("/login");
}