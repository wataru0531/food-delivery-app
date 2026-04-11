

// CartSheet.tsx
// /components/CartSheet.tsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { ShoppingCart } from "lucide-react";

import { CartType } from "@/types";



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
          {"#"}
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
            <div>アイテム</div>
          ) : (
            <div>空</div>
          )
        }

      </SheetContent>
    </Sheet>
  )
}



