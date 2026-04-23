
// MenuModal.tsx
// 店舗詳細ページ、メニュークリック時

"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "./ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { CartItemType, CartType, MenuType } from "@/types";
import { useEffect, useState } from "react";
import { addToCartAction } from "@/app/(private)/actions/cartActions";
import { KeyedMutator } from "swr";
// import { MenuType } from "@/types";

type MenuModalType = {
  isOpen: boolean;
  closeModal: () => void;
  selectedItem: MenuType | null;
  restaurantId: string;
  openCart: () => void;
  targetCart: CartType | null; // 現在選択中の店舗データを取得
  mutateCart: KeyedMutator<CartType[]>;
}


export default function MenuModal({ 
  isOpen, 
  closeModal, 
  selectedItem, 
  restaurantId, 
  openCart, 
  targetCart,
  mutateCart,
}: MenuModalType) {
  // console.log(isOpen);
  // console.log(selectedItem); // {id: 20, name: '牛丼', price: 600, photoUrl: 'https://ndpohcdojjruiosbmyxz.supabase.co/storage/v1/object/public/menus/japanese/gyudon.webp'}
  // console.log(targetCart); // {id: 10, restaurant_id: 'ChIJZZPMQQDfAGARxEZtPATdWew', cart_items: Array(4), restaurantName: 'RAMEN JUNKEYZ', photoUrl: '/no-image.jpeg'}

  // ✅ 商品の数量
  const [ quantity, setQuantity ] = useState(1);
  const onChangeSetQuantity = (e:React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>) => {
    // console.log(e.target.value, typeof e.target.value); // string
    setQuantity(Number(e.target.value)); 
  }

  // ✅ 現在選択中の店舗のデータを取得
  const foundItem = targetCart ? targetCart?.cart_items.find(item => {
    // 全ての店舗の商品と、現在選択中の商品とを検証して取得
    return item.menus.id === selectedItem?.id;
  }) : null;

  const existingCartItem = foundItem ?? null; // undefinedを返す時もあるので
  // console.log(existingCartItem); // {id: 20, menus: {…}, quantity: 1} もしくは、null

  useEffect(() => {
    if(!selectedItem) return;

    setQuantity(existingCartItem?.quantity ?? 1); // 数量を更新

  }, [ selectedItem, existingCartItem ]); // アイテムを選択するたびに発火。
                                          // useEffect内の変数は依存配列に含める

  // ✅ カートに商品を追加する処理 サーバーアクション
  const handleAddToCard = async () => {
    if(!selectedItem) return;

    try {
      // console.log(restaurantId);
      // ⭐️ サーバーアクション。テーブルにテーブルに追加。商品、量、店舗のid
      const response =  await addToCartAction(selectedItem, quantity, restaurantId);
      // console.log(response); // タイプ、追加した商品のid

      // 商品を追加した時に、データを再取得するので再レンダリングすることができる
      // → これを呼び出すことで、useCartの、/api/cart のエンドポイントが再フェッチされる
      //   👉 余計なデータまでも取得したりしてしまうので、ここで直接更新していく
      mutateCart((prevCarts: CartType[] | undefined) => { // 👉 SWRで管理している既存のcarts。取得できるまではundefined
        // console.log(prevCarts); // 👉 今画面上に表示されているデータ
        // 👉 すぐに画面を更新するのであれば、引数のprevCartsを更新していく
        if(!prevCarts) return;

        // 選択中の店舗がない場合
        if(response.type === "new") {
          // ✅ カートを新規作成
          const { cart } = response; // 挿入したカートデータを取得

          return [...prevCarts, cart];
        }

        if(!targetCart) return;
        const cart = { ...targetCart }; // そのままのカートのオブジェクトでは更新できないのでコピーする

        // すでにカートがある場合
        if(existingCartItem) {
          // ✅ 数量更新
          cart.cart_items = cart.cart_items.map(item => {
            // カートにアイテムがある場合(idで判定)は、カートの数量を更新
            return item.id === existingCartItem.id ? { ...item, quantity: quantity }
                                                    : item; 
          })

        } else {
          // ✅ アイテムを追加
          const newCartItem: CartItemType = {
            id: response.id,
            menus: {
              id: selectedItem.id,
              name: selectedItem.name,
              price: selectedItem.price,
              photoUrl: selectedItem.photoUrl,
            },
            quantity: quantity,
          }
          cart.cart_items = [...cart.cart_items, newCartItem];
        }

        // 更新したcartのidと一致するなら、更新したカートを返す。そうでないカートはそのまま返す
        return prevCarts.map(prevCart => prevCart.id === cart.id ? cart : prevCart );
      }, false); // 👉 データを再取得しない

      openCart(); // カートシートを開く
      closeModal(); // モーダルを閉じる
    } catch(error) {
      console.error(error);
      alert("エラーが発生しました。");
    }
  }

  return (
    <Dialog 
      open={ isOpen } 
      onOpenChange={(open) => {
        // console.log(open)
        !open && closeModal();// モーダルの外をクリックした時に閉じる
      }}
      >
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent className="lg:max-w-4xl">
        {
          selectedItem && (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle>{ selectedItem.name }</DialogTitle>
                <DialogDescription>{ selectedItem.name } の詳細</DialogDescription>
              </DialogHeader>

              <div className="flex gap-6">
                {/* 左 画像 */}
                <div className="relative aspect-square w-1/2 rounded-lg overflow-hidden">
                  <Image
                    fill
                    src={selectedItem.photoUrl || "/no_image.png"}
                    alt={ selectedItem.name }
                    className="object-cover"
                  />
                </div>

                {/* 右 詳細 */}
                <div className="flex flex-col flex-1 w-1/2">
                  {/* 上部：名前と単価 */}
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">{"メニュー名"}</p>
                    <p className="text-lg font-semibold text-muted-foreground">
                      ￥{ selectedItem.price }
                    </p>
                  </div>

                  {/* 中央：数量セレクト */}
                  <div className="mt-4">
                    <label htmlFor="quantity" className="sr-only">
                      数量
                    </label>
                    <select
                      id="quantity"
                      name="quantity"
                      className="border rounded-full pr-8 pl-4 h-10"
                      aria-label="購入数量"
                      value={ quantity }
                      onChange={ onChangeSetQuantity }
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option> 
                    </select>
                  </div>

                  <DialogClose asChild>
                    <Button
                      type="button"
                      size="lg"
                      className="mt-6 h-14 text-lg font-semibold"
                      onClick={ handleAddToCard }
                    >
                      { 
                        existingCartItem ? "商品を更新する" 
                                         : `商品を追加（￥${ selectedItem.price * quantity })`
                      }
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </>
          )
        }
      </DialogContent>
    </Dialog>
  );
}
