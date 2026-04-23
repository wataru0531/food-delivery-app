
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

import { CartItemType, CartType } from "@/types";
import { Button } from "./ui/button";
import Link from "next/link";
import { updateCartItemAction } from "@/app/(private)/actions/cartActions";
import { KeyedMutator } from "swr";


type CartSheetPropsType = {
  sheetCart: CartType | null; // カートはそもそも存在しないためnull
  cartCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  mutateCart: KeyedMutator<CartType[]>;
}


export default function CartSheet({ 
  sheetCart, 
  cartCount, 
  isOpen, 
  closeCart, 
  openCart,
  mutateCart
}: CartSheetPropsType){
  // console.log(sheetCart); // { id: 5, restaurant_id: 'ChIJM88kepPfAGARiEXZJTN_Jc8', cart_items: Array(1), restaurantName: 'ハルハル', photoUrl: '/no-image.jpeg' }
  // console.log(cartCount); // 3 ... アイテムの数

  // ✅　カートのアイテムの合計金額を計算
  const calculateItemTotal = (item: CartItemType) => {
    // console.log(item);
    // {id: 10, restaurant_id: 'ChIJZZPMQQDfAGARxEZtPATdWew', cart_items: [ {id: 19, menus: {id: 56, name: '醤油ラーメン', price: 800, photoUrl: 'https://ndpohcdojjruiosbmyxz.supabase.co/storage/v1/object/public/menus/ramen/shoyu-ramen.webp'}, quantity: 3}], restaurantName: 'RAMEN JUNKEYZ', photoUrl: '/no-image.jpeg'}
    return item.quantity * item.menus.price;
  }

  // ✅ カートアイテムの合計金額を算出
  const calculateSubTotal = (cartItems: CartItemType[]) => {
    // console.log(items); // (3) [{id: 19, menus: {id: 56, name: '醤油ラーメン', price: 800, photoUrl: 'https://ndpohcdojjruiosbmyxz.supabase.co/storage/v1/object/public/menus/ramen/shoyu-ramen.webp'}, quantity: 3}, {…}, {…}]

    return cartItems.reduce((accu, curr) => {
      // console.log(accu, curr)
      return accu + calculateItemTotal(curr);
    }, 0)
  }

  // ✅ 数量を更新する処理
  // ①要素 ②そのアイテムのid
  const handleUpdateCurtItem = async (value: string, cartItemId: number) => {
    // console.log(value, cartItemId); // セレクト要素の番号 19

    if(!sheetCart) return; // nullの可能性を排除
    const quantity = Number(value); // selectの数を数値型に変換

    try {
       // 更新。サーバーアクション
      const data = await updateCartItemAction(quantity, cartItemId, sheetCart.id); // 数量、アイテムのid、どのカート(店舗)か
      // console.log(data);

      // ⭐️ 即画面に反映させる　mutate
      mutateCart(prevCarts => {
        if(!prevCarts) return;

        // ✅ 削除するを選択した場合 その商品自体がなくなる
        if(quantity === 1) {
          if(sheetCart.cart_items.length === 1) {
            // カート自体を削除
          }

          // カートの中のアイテムを削除
        }


        // ✅ 数量を更新する場合
      }, false); // ローカルのみ更新して再フェッチしない。

    } catch(error) {
      console.error(error);
      alert("エラーが発生しました。");
    }
  }

  return (
    <Sheet 
      open={ isOpen } // openがtrueなら開く
      onOpenChange={ (open) => open ? openCart() : closeCart() } // リストの状態を変更(罰印、黒レイヤーをクリック時)
    > 
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
              {/* ヘッダー */}
              <div className="flex justify-between items-center gap-4">
                <SheetClose asChild>
                  <Link 
                    href={`/restaurant/${sheetCart.restaurant_id}`}
                    className="font-bold text-2xl"
                    // onClick={ () => closeCart() }
                  >
                    { sheetCart.restaurantName }
                  </Link>
                </SheetClose>
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

              {/* メニューエリア */}
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
                          onChange={ (e:React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>) => handleUpdateCurtItem(e.target.value, item.id) }
                        >
                          <option value="0">削除する</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                        {/* 合計金額 */}
                        <p>￥{ calculateItemTotal(item).toLocaleString() }</p>
                      </div>
                    </li>
                  ))
                }
              </ul>

              {/* 小計など */}
              <div className="flex justify-between items-center font-bold text-lg">
                <div>小計</div>
                <div>{ calculateSubTotal(sheetCart.cart_items).toLocaleString() }</div>
              </div>
              
              {/*
                asChild ... ラッパーを作らずに、中のButtonをそのまま使う
                            ここでは、ラッパーを作らずにaタグがトップにきている
                            Buttonの機能やデザインを継承してaタグとして機能する
              */}
              <SheetClose asChild>
                <Button asChild>
                  <Link href={`/checkout/${sheetCart.restaurant_id}`}>お会計に進む</Link>
                </Button>
              </SheetClose>

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



