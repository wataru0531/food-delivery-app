
// login

import { Button } from "@/components/ui/button";

import { login } from "./actions"


export default function LoginPage() {
  return (
    <form>
      <Button
        // ✅ formAction
        //    → ボタンを押したときに実行するフォームの送信先(関数)を指定するための“HTML標準の属性”
        //      ただ Next.jsではこれに「サーバーアクション関数」を直接渡せるよう拡張されている
        formAction={ login } 
        variant="outline"
        size="lg"
      >Login</Button>
    </form>
  )
}


