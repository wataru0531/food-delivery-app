
// CartSheet.tsx
// /components/CartSheet.tsx

import Image from "next/image";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ShoppingCart, Trash2 } from "lucide-react";

import { CartType } from "@/types";
import { Button } from "./ui/button";
import Link from "next/link";


// ✅ カートでシートで表示
//    → カートには何も入っていない場合、1件の時に表示

type CartSheetPropsType = {
  sheetCart: CartType | null; // カートはそもそも存在しないためnull
  cartCount: number;
}


export default function CartSheet({ sheetCart, cartCount }: CartSheetPropsType){
  // console.log(sheetCart); // { id: 5, restaurant_id: 'ChIJM88kepPfAGARiEXZJTN_Jc8', cart_items: Array(1), restaurantName: 'ハルハル', photoUrl: '/no-image.jpeg' }
  // console.log(cartCount); // 3 ... アイテムの数

  return (
    <Sheet>
      <SheetTrigger className="relative cursor-pointer">
        {/* アイコン */}
        <ShoppingCart />

        {/* アイテムの数 */}
        <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-green-700 rounded-full size-4 text-xs text-primary-foreground flex items-center justify-center">
          { cartCount }
        </span>
      </SheetTrigger>

      <SheetContent className="p-6">
        <SheetHeader className="sr-only">
          <SheetTitle>カート</SheetTitle>
          <SheetDescription>
            カート内の商品を確認・編集できます。購入手続きに進むには「お会計に進む」へ。
          </SheetDescription>
        </SheetHeader>

        {/* 
          カートの件数があるかないかで条件分岐する
        */}

        {
          sheetCart ? (
            <>
              <div className="flex justify-between items-center gap-4">
                <Link 
                  href={`/restaurant/${sheetCart.restaurant_id}`}
                  className="font-bold text-2xl"
                >
                  { sheetCart.restaurantName }
                </Link>
                <div>
                  {/* ホバー時の挙動 */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant="ghost">
                          <Trash2 color="red" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>ゴミ箱を空にする</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <ul className="flex-1 overflow-y-auto">
                {/*
                  1つのアイテム
                  cart_items 
                  →   {
                        id: 15, 
                        menus: {id: 217, name: 'ビビンバ', price: 900, photoUrl: "https://ndpohc..."}, 
                        quantity: 2
                      } 
                */}
                {
                  sheetCart.cart_items.map((item) => (
                    <li key={ item.id } className="border-b py-5">
                      <div className="flex items-center justify-between">
                        <p>{ item.menus.name }</p>
                        <div className="relative w-[72px] h-[72px]">
                          <Image 
                            src={ item.menus.photoUrl }
                            alt={ item.menus.name }
                            fill
                            sizes="72px"
                            className="object-cover rounded"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="quantity" className="sr-only">
                          数量
                        </label>
                        <select 
                          name="quantity" 
                          id="quantity" 
                          className="border rounded-full pr-8 pl04 bg-muted h-9"
                          value={item.quantity}
                          onChange={() => {}}
                        >
                          <option value="0">削除する</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                        <p>￥{ item.menus.price }</p>
                      </div>
                    </li>
                  ))
                }
                
                
              </ul>

            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 h-full ">
              <Image
                src={"/cart.png"}
                width={192}
                height={192}
                alt="カート"
              />
              <h2 className="text-xl font-bold ">商品をカートに追加しよう</h2>
              <SheetClose asChild>
                <Button className="rounded-full">お買い物を開始する</Button>
              </SheetClose>
            </div>
          )
        }
      </SheetContent>
    </Sheet>
  )
}



