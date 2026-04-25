
// ui/components/CartSummary.tsx

"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCart } from "@/fooks/cart/useCart";
import CartSkeleton from "./CartSkeleton";

type CartSummaryPropsType = {
  restaurantId: string;
}

const CartSummary = ({ restaurantId }: CartSummaryPropsType) => {
  // ✅　useSWRでデータを取得
  const { 
    targetCart: cart,
    isLoading,
    cartsError,
    mutateCart
   } = useCart(restaurantId); // 会計に進んだ時のカートデータ
  // console.log(cart); 
  // { id: 12, restaurant_id: 'ChIJZZPMQQDfAGARxEZtPATdWew', cart_items: Array(3), restaurantName: 'RAMEN JUNKEYZ', photoUrl: '/no-image.jpeg'}

  if(cartsError) {
    console.error(cartsError);
    return <div>{ cartsError.message }</div>
  }

  if(isLoading) return <CartSkeleton />

  // cartがnullの時。urlパラメータがめちゃくちゃなときなど(動的ルートのurlがおかしい時)
  if(cart === null) return <div>カートが見つかりません。</div>

  // console.log(cart.cart_items);
  // (3) [{id: 31, menus: {id: 56, name: '醤油ラーメン', price: 800, photoUrl: 'https://ndpohcdojjruiosbmyxz.supabase.co/storage/v1/object/public/menus/ramen/shoyu-ramen.webp'}, quantity: 3}, {…}, {…}]

  return (
    <Card className="max-w-md min-w-[420px]">
      {/* ヘッダー */}
      <CardHeader>
        <Link href={`/restaurant/${ cart.restaurant_id }`} className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative size-12 rounded-full overflow-hidden flex-none">
              <Image
                src={ cart.photoUrl ?? "/no_image.png"}
                alt={ cart.restaurantName ?? "レストラン画像" }
                fill
                className="object-cover w-full h-full"
                sizes="48px"
              />
            </div>
            <div className="font-bold">{ cart.restaurantName }</div>
          </div>
          <ChevronRight size={16} />
        </Link>
        <Button className="cursor-pointer">本ページの内容を確認の上、注文を確定する</Button>
      </CardHeader>

      {/* コンテンツ */}
      <CardContent>
        <hr className="my-2" />
        
        <Accordion type="single" collapsible defaultValue="item-1">
          {
            cart.cart_items.map(cartItem => {
              return (
                <AccordionItem key={ cartItem.id } value="item-1">
                  <AccordionTrigger>カートの中身{ cartItem.quantity }個の商品</AccordionTrigger>
                  <AccordionContent className="flex items-center">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative size-14 rounded-full overflow-hidden flex-none">
                        <Image
                          src={ cartItem.menus.photoUrl ?? "/no_image.png"}
                          alt={ cartItem.menus.name ?? "メニュー名" }
                          fill
                          sizes="56px"
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <div className="font-bold">{ cartItem.menus.name }</div>
                        <p className="text-muted-foreground text-sm">￥{ cartItem.menus.price }</p>
                      </div>
                    </div>

                    <label htmlFor={`quantity`} className="sr-only">
                      数量
                    </label>
                    <select
                      id={`quantity`}
                      name="quantity"
                      className="border rounded-full pr-8 pl-4 bg-muted h-9"
                    >
                      <option value="0">削除する</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </AccordionContent>
                </AccordionItem>
              )
            })
          }
          
        </Accordion>
      </CardContent>

      {/* 注文の合計 */}
      <CardFooter>
        <div className="w-full">
          <h6 className="font-bold text-xl mb-4">注文の合計額</h6>
          <ul className="grid gap-4">
            <li className="flex justify-between text-muted-foreground">
              <p>小計</p>
              <p>¥{1000}</p>
            </li>
            <li className="flex justify-between text-muted-foreground">
              <p>手数料</p>
              <p>¥ {0}</p>
            </li>
            <li className="flex justify-between text-muted-foreground">
              <p>サービス</p>
              <p>¥ {0}</p>
            </li>
            <li className="flex justify-between text-muted-foreground">
              <p>配達</p>
              <p>¥ {0}</p>
            </li>
          </ul>
          <hr className="my-2" />
          <div className="flex justify-between font-medium">
            <p>合計</p>
            <p>¥{1000}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CartSummary;









