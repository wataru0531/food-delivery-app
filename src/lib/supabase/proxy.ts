
// lib/supabase/proxy.ts

// Supabaseの認証の心臓部
// 👉 ページに入る前に「ログイン確認」と「トークン更新」をする
//    ... ⭐️ /proxy.ts (middleware）から呼ばれる関数

// 👉 proxy.tsかmiddleware.tsにリダイレクト処理をかますことで、
//    各ファイルでリダイレクト処理を書く必要がなくなる。

// ① ユーザーがページにアクセス
// ② proxy が最初に動く 👉 ここで、updateSessionが発火
// ③ ログイン確認
// ④ 必要ならトークン更新
// ⑤ 未ログインなら /login にリダイレクト
// ⑥ 問題なければページ表示

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'


export async function updateSession(request: NextRequest) {
  // 後にCookieを入れる変数を作成
  // NextResponse → Next.jsが用意している、middleware専用のResponseオブジェクト
  // next() → ブロックしないで次へ進める
  // requestオブジェクト → この request オブジェクトを使って続行してください」という意味。
  //                     👉 Cookie情報が入っている
  // NextResponse.next() ... この request をそのまま次の処理へ渡して続行してください」という指示
  let supabaseResponse = NextResponse.next({ request })

  // サーバー用Supabaseクライアント
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: { // Cookieの読み書きを定義。Supabaseに教えている
        getAll() {
          return request.cookies.getAll(); // リクエストのCookieをSupabaseに渡す
        },
        setAll(cookiesToSet) { // トークン更新が必要なら書き戻せるようにする
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  // ⭐️ ログイン確認
  // getClaims() → JWTの署名を検証、トークンが期限内かどうかチェック、毎回公開鍵で検証をおこなう
  // また、必要ならリフレッシュトークンを行う。
  // 👉 なければログイン画面に、あればそのCookieを返す
  const { data } = await supabase.auth.getClaims()

  const user = data?.claims

  if (
    // ユーザーがいなくて、今アクセスしているURLが /login でも /auth でもないなら
    !user && 
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // /loginにリダイレクト
    const url = request.nextUrl.clone() // 直接書き換えないためにclone
    console.log(url);
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse; // 👉 トークンが更新されていた場合、新しいCookieがここに入っている
                           // 👉 それをそのままブラウザに返す
                           //    ブラウザのCookieが更新される
}