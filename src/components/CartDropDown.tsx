

// CartDropDown.tsx
// components/CartDropDown.tsx

// ✅ カートに2件以上

import { ShoppingCart } from "lucide-react";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CartType } from "@/types";

type CartDropDownType = {
  carts: CartType[] | undefined; // 👉 useSWRでデータを取得するまではundefinedになるため
}

export default function CartDropDown({ carts }:CartDropDownType) {
  return (
    <DropdownMenu>

      {/* 開くためにトリガー */}
      <DropdownMenuTrigger className="relative cursor-pointer">
        <ShoppingCart />
        <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-green-700 rounded-full size-4 text-xs text-primary-foreground flex items-center justify-center">
          {10}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[420px]">

        {/* カート1件分のアイテム */}
        <DropdownMenuItem className="flex items-center p-4 justify-between">
          <div className="flex gap-3 flex-1 min-w-0">
            <div className="w-[64px] h-[64px] relative overflow-hidden rounded-full flex-none">
              <Image
                fill
                src={"/no_image.png"}
                alt={"レストラン名"}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-base ">{"レストラン名"}</p>
              <p>小計: ￥{5000}</p>
            </div>
          </div>
          <div className="flex items-center justify-center size-7 font-medium rounded-full bg-primary text-popover text-xs">
            {5}
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
