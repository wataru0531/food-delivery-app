
import Link from "next/link";

import { JSX } from "react";
import MenuSheet from "./MenuSheet";


export default function Header():JSX.Element {
  return(
    <header className="w-full h-16 bg-background fixed top-0 left-0">
      <div className="mx-auto px-4 max-w-[1280px] space-x-4 h-full flex items-center">
        <MenuSheet />

        <div className="font-bold">
          <Link href={"/"}>delivery APP</Link>
        </div>
        <div>住所を選択</div>
        <div className="flex-1 bg-yellow-300">検索バー</div>
        <div>カート</div>

      </div>
    </header>
  )
}