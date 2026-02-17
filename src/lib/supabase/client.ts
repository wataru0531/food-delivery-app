
// lib/supabase/client.ts

// → ブラウザ用のクライアント
// Supabaseをブラウザ（Client Component）で使うための“専用の接続装置”


import { createBrowserClient } from '@supabase/ssr'
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}


// 
// ページ表示前にproxyが走る
//         ↓
// トークン検証＆更新
//         ↓
// ページ表示