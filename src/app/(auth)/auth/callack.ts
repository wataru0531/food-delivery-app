

// /auth/callback.ts

// ✅ ユーザーの認証情報を取得
// → サーバーアクションでGoogleの認証が済んだら発火

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server' 


export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code'); // Googleが発行した認可コード
  let next = searchParams.get('next') ?? '/'
  
  if (!next.startsWith('/')) {
    next = '/'
  }

  // ✅ Google認証成功時のみ処理
  if (code) {
    const supabase = await createClient(); // Cookie対応のサーバークライアント
    
    // ✅ Googleからもらった認可コードをSupabaseに渡す
    // → SupabaseがGoogleと通信
    // → 本物か検証
    // → セッションを発行
    // → Cookieに保存
    // 👉 ここで本当のログインが完了
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    // 
    if(!error) {
      // ロードバランサー対策
      // → 本番環境でvercel、Load balancerなどを使うと、元のURLが変わる可能性がある。
      //   それを取得している
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'; // 開発環境かどうかを確認

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`); // 開発環境のurl
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
