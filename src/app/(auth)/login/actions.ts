
"use server";

// ✅ サーバーアクション
// APIを書かなくてもいい → APIルートを書かなくてもいい。
//                      これまでは、/api/login/route.ts など、自分で作る必要があった
// 型安全 → jsonの変換をしなくていい
// 自動でサーバー実行 → "use server" と書くだけ
// フロントとサーバーとの境界が消えた

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server";


export async function login() {
  // Googleログイン
  console.log("Google Login")

}

