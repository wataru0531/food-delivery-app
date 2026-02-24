
// MenuSheet

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Bookmark, Heart, TextAlignJustify } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/(auth)/login/actions";


export default async function MenuSheet() {

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  // console.log(user); // {id: 'c937bcb5-dc96-438e-9298-b54168bb8afb', aud: 'authenticated', role: 'authenticated', email: 'obito0531@gmail.com', email_confirmed_at: '2026-02-20T08:48:54.034038Z', …}

  if(!user) redirect("/login");

  const { avatar_url, full_name } = user?.user_metadata;
  // console.log(avatar_url)

  

  return (
    <Sheet>
      {/* 
        ボタン
        asChild ... ラッパー（外側のタグ）を作らず、子どもをそのまま使う
                    → 親(SheetTrigger)が持っている機能や属性を、子に“合成して渡す”
                    親の見た目は引き継がない
                    親のタグも作られない
                    必要な props だけ合成される
      */}
      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <TextAlignJustify />
        </Button>
      </SheetTrigger>

      {/* ドロワー dialog */}
      <SheetContent side={"left"} className="p-6 w-72">
        <SheetHeader className="sr-only">
          <SheetTitle>メニュー情報</SheetTitle>
          <SheetDescription>
            ユーザー情報とメニュー情報を表示
          </SheetDescription>
        </SheetHeader>

        {/* ユーザ情報 */}
        <div className="flex items-center gap-5">
          <div>
            <Avatar>
              <AvatarImage src={ avatar_url } />
              <AvatarFallback>ユーザー名</AvatarFallback>
              {/* → ユーザーが表示されるまでのフォールバック画像 */}
            </Avatar>
          </div>
          <div>
            <div className="font-bold">{ full_name }</div>
            <div>
              <Link href="#" className="text-green-500 text-xs">アカウントを管理</Link>
              </div>
          </div>
        </div>

        {/* メニューエリア */}
        <ul className="space-y-4">
          <li>
            <Link href={"orders"} className="flex items-center gap-4">
              <div>
                <Bookmark color="bg-primary" fill="bg-primary" />
              </div>
              <span className="block font-bold">ご注文内容</span>
            </Link>
          </li>
          <li>
            <Link href={"favorites"} className="flex items-center gap-4">
              <div>
                <Heart color="#e54399" fill="#e54399" />
              </div>
              <span className="block font-bold">お気に入り</span>
            </Link>
          </li>
        </ul>

        {/* サインアウト */}
        <SheetFooter>
          {/* 
            サーバーアクション 
            → formに書く場合は、action属性に書く
              buttonに書く場合は、formAction属性に書く
          */}
          <form>
            {/* サーバー側でログアウト処理をする */}
            <Button
              formAction={ logout }
              className="w-full xl:hover:cursor-pointer"
            >Logout</Button>
          </form>
        </SheetFooter>

      </SheetContent>
    </Sheet>
  )
}

