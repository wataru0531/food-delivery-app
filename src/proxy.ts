
// proxy.ts
// ⭐️ ルート直下に記述(src直下) → 自動実行される
//                            実質、middlewareと同じ挙動をとる

// updateSession を実行して、その結果をそのまま返す

// ✅　proxy.tsは全てのページをキャッチする
// ① ブラウザがページにアクセス
// ② proxy.ts が実行される
// ③ updateSession() が呼ばれる
// ④ 認証チェック
// ⑤ OKならページへ進む
//    ダメなら/loginにリダイレクト

import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/proxy"

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  // ✅　matcher ... 「どのURLでproxyを実行するか」。  matcher ... 一致する / 合う
  // 除外しているもの ... _next/static、_next/image、favicon.ico、画像ファイル
  //                   👉 これらでは認証チェックをしない。これらで認証チェックをしているとおそくなるから　
  matcher: [
    // "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}