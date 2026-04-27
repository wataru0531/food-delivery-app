

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
import { SetStateAction } from "react";
import { sumItems } from "@/lib/cart/utils";
import { calculateSubTotal } from "@/lib/restaurants/utils";

type CartDropDownType = {
  carts: CartType[]; // 👉 useSWRでデータを取得するまではundefinedになるため
  setSelectedCart: React.Dispatch<SetStateAction<CartType | null>>;
  openCart: () => void;
}


export default function CartDropDown({ carts, setSelectedCart, openCart }: CartDropDownType) {
  // console.log(carts); 
  // [{id: 10, restaurant_id: 'ChIJZZPMQQDfAGARxEZtPATdWew', cart_items: [{id: 19, menus: {id: 56, name: '醤油ラーメン', price: 800, photoUrl: 'https://ndpohcdojjruiosbmyxz.supabase.co/storage/v1/object/public/menus/ramen/shoyu-ramen.webp'}, quantity: 3}, {}, ...], restaurantName: 'RAMEN JUNKEYZ', photoUrl: '/no-image.jpeg'}, {}, ...]

  return (
    <DropdownMenu>
      {/* 開くためにトリガー */}
      <DropdownMenuTrigger className="relative cursor-pointer">
        <ShoppingCart />
        <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-green-700 rounded-full size-4 text-xs text-primary-foreground flex items-center justify-center">
          { carts.length }
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[420px]">
        {
          carts && carts.map((cart) => (
            <DropdownMenuItem 
              key={cart.id} 
              className="flex items-center p-4 justify-between"
              onClick={ () => {
                setSelectedCart(cart);
                openCart(); // リストをtrueにする
              }}
            >
              <div className="flex gap-3 flex-1 min-w-0">
                <div className="w-[64px] h-[64px] relative overflow-hidden rounded-full flex-none">
                  <Image
                    fill
                    src={ cart.photoUrl ?? "/no-image.jpeg" }
                    alt={ cart.restaurantName ?? "店舗名"}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-base ">{ cart.restaurantName }</p>
                  <p>小計: ￥{ calculateSubTotal(cart.cart_items).toLocaleString() }</p>
                </div>
              </div>
              <div className="flex items-center justify-center size-7 font-medium rounded-full bg-primary text-popover text-xs">
                { sumItems(cart.cart_items) }
              </div>
            </DropdownMenuItem>
          ))
        }
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
