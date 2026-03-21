
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

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server";


// ✅ Googleログインを始めるために外部へリダイレクト
// ① Supabaseクライアントを作成
// ② Googleログインを開始するリクエストを送る
//    → Supabaseに依頼：「Googleログイン用のURLをください」
// ③ SupabaseがURLを返す
//    → Googleログインを開始するためのURL
// ④ URLがあればリダイレクト
//    → ブラウザが移動
// ⑤ Supabase → Googleログイン画面へ遷移
//   → ここでメールアドレス、パスワードの本人確認の認証を行う
// ⑥ 認証が成功すれば、redirectTo: 'http://localhost:3000/auth/callback' に移動、発火

// Google側
export async function login() {
  // Googleログイン
  // console.log("Google Login");
  const supabase = await createClient();

  // Supabaseに、「Google認証を開始するためのURLを生成して」と依頼
  // → 返ってきたdata.urlが、Googleログインを開始するための専用URL
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google", // Googleでログインするので
    options: {
      redirectTo: 'http://localhost:3000/auth/callback', // → 認証が済んだ時のリダイレクト先
                                                         //   callback.tsのGETを発火 
                                                         //   → この時、クエリパラメータで?code=xxxxx がついてroute.tsxに
    },
  });

  if(error) console.error(error);

  // ユーザーのブラウザが、そのURLへ移動 
  // →　Supabase経由でGoogleへリダイレクト 
  //    → ここで初めて認証。パスワード入力など、本人確認を行う。
  //      ※ そのブラウザですでに認証が済んでいる場合には、確認画面はでてこない
  //    → ⭐️ 成功したら、redirectToに戻る。
  //         このとき、?code=xxx のクエリパラメータが付いてくる。
  if(data.url) {
    // console.log("data.url!!", data.url); 
    // https://ndpohcdojjruiosbmyxz.supabase.co/auth/v1/authorize?provider=google&redirect_to=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&code_challenge=7MKaAxegpcctlzNWeS_f04Gx-_0YPD9odpDM0rtBUDk&code_challenge_method=s256 
    redirect(data.url);
  }
}


// ✅ ログアウト
export async function logout(){
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signOut();
  if(error) console.error(error);

  redirect("/login");
}