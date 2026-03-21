

// server.ts

// ✅ サーバー用のクライアント
// サーバー専用のSupabase接続を作成
// ・ログインユーザー取得
// ・SSRでデータ取得
// ・ページ保護

// 今アクセスしているユーザーのCookieを取得するための関数
// Cookieの中 👉 アクセストークン(JWT)、リフレッシュトークン

// Supabase → 認証トークンをcookieから読む
//            必要ならcookieを書き換える必要がある

// しかし、サーバー 👉 ブラウザのcookieに直接アクセスできない
//                  サーバーは「リクエストに含まれているCookie」しか読めないので
// だから、「cookieの読み書きはこれを使ってね」と渡している

// ブラウザ
//   ↓
// Cookie（JWT）
//   ↓
// Server Component
//   ↓
// server.ts が cookieをSupabaseに渡す
//   ↓
// Supabaseがユーザー確認

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { Database } from '../../../database.types';

export async function createClient() {
  const cookieStore = await cookies(); // 👉 今リクエストのcookieを取得

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        // 👇 Cookieの読み書きを行う
        getAll() { // Cookie情報の読み取り
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) { // → Cookieに書き込み。主にトークンが更新された時に使われている
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}