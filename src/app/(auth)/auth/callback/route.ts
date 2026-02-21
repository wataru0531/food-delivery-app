
// /auth/callback.ts

// ✅ ユーザーの認証情報を取得
// → サーバーアクションでGoogleの認証が済んだら発火

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server' 


// ✅ GET ... /auth/callback にGETが来た時に実行される関数
// → リダイレクト(302)は、Location: https://your-site.com/auth/callback?code=xxxxx
// 　というレスポンスを返す。
//   ブラウザはそれを受け取ると、そのURLにGETリクエストを送信するため。
export async function GET(request: Request) {
  // console.log(request.url); 
  // // http://localhost:3000/auth/callback?code=aeb4f261-961d-4e44-9ec7-7c2f24565367
  const { searchParams, origin } = new URL(request.url);
  // console.log(searchParams, origin);
  // URLSearchParams { 'code' => 'aeb4f261-961d-4e44-9ec7-7c2f24565367' } http://localhost:3000
  const code = searchParams.get('code'); // ⭐️ Googleが発行した認可コード
  let next = searchParams.get('next') ?? '/'; // ログイン後にどのパスに移動するか
  // console.log(next); // /
  
  if(!next.startsWith('/')) { // /で始まっているかどうか。?next=https://evil.com のような攻撃が可能なため(Open Redirect対策)
    next = '/'
  }

  // ✅ Google認証成功時のみ処理
  if(code) {
    const supabase = await createClient(); // Cookie対応のサーバークライアント

    // ✅ JWTセッションをCookieに保存する処理
    // ① Googleログイン
    // ② Googleが code(認可コード) をブラウザ経由でアプリに発行
    // ③ アプリが code を受け取る
    // ④ SupabaseがGoogleのトークンエンドポイントに code を渡す 👉 ここからが exchangeCodeForSession
    //    → Googleが最初からアクセストークンをブラウザに渡していたら、JSから簡単に盗めるため
    // ⑤ Googleが認可コードを access_token に交換して返す
    // ⑥ Supabaseがその情報を検証
    // ⑦ Supabaseが独自のJWTセッションを発行
    //    → グーブルが発行するアクセストークンは“Google用”だから
    //      アプリのユーザー管理を統一するため
    //      セキュリティと制御のため
    // ⑧ Cookieに保存
    // ※ Cookieに保存した場合は、自動でサーバーにも送信される
    // ⑨ 次回アクセス時、サーバーがCookieからJWT読み取り
    // ➓ ログイン状態を維持
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    // 
    if(!error) {
      // ユーザーが実際にアクセスしている本物のドメインを取得。ロードバランサー対策
      // → 本番環境では「本物のドメイン」でリダイレクトするという処理
      const forwardedHost = request.headers.get('x-forwarded-host')
      // console.log(forwardedHost); // localhost:3000
      const isLocalEnv = process.env.NODE_ENV === 'development'; // 開発環境かどうかを確認
      // console.log(isLocalEnv); // true

      if(isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`); // 👉 開発環境のurlにリダイレクト
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // ✅ 認証失敗時はエラーページにレイダイレクト
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
