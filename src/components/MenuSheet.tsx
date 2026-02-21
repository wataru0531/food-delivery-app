
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
import { TextAlignJustify } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"



export default function MenuSheet() {
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
          <div>avatar</div>
          <div>
            <div className="font-bold">ユーザー名</div>
            <div>
              <Link href="#" className="text-green-500 text-xs">アカウントを管理</Link>
              </div>
          </div>
        </div>

      </SheetContent>
    </Sheet>
  )
}

