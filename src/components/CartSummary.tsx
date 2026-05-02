
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
import { sumItems } from "@/lib/cart/utils";
import { calculateItemTotal, calculateSubTotal } from "@/lib/restaurants/utils";
import { checkoutAction, updateCartItemAction } from "@/app/(private)/actions/cartActions";
import { useRouter } from "next/navigation";

type CartSummaryPropsType = {
  restaurantId: string;
}


const CartSummary = ({ restaurantId }: CartSummaryPropsType) => {
  const router = useRouter();

  // ✅ 会計に進んだ時のカートデータを取得。SWR
  const { 
    targetCart: cart,
    isLoading,
    cartsError,
    mutateCart
  } = useCart(restaurantId); 
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

  // ✅ 金額関連
  const subtotal = calculateSubTotal(cart.cart_items); // 小計
  // console.log(subtotal); // 5,800
  const fee = 0; // 手数料
  const service = 0; // サービス
  const delivery = subtotal >= 3500 ? 0 : 410; // 配送料
  const total = subtotal +fee + service + delivery; // 合計

  // ✅ 数量を更新する処理
  // ①select要素の数値 ②そのアイテムのid
  const handleUpdateCurtItem = async (value: string, cartItemId: number) => {
    // console.log(value, cartItemId); // セレクト要素の番号 19

    const quantity = Number(value); // selectの数を数値型に変換

    try {
      // 更新。サーバーアクション → DBのデータを変更
      const data = await updateCartItemAction(quantity, cartItemId, cart.id); // 数量、アイテムのid、どのカート(店舗)か
      // console.log(data);

      // ⭐️ 即画面に反映させる　mutate → フロントのUIを更新
      //    → ここではサーバーアクションでDBを更新して、フロントのUIを自分で更新する必要がある
      const copyCart = {...cart}; // SWRの値を直接反映はできないのでコピーを用意する

      // ✅ 削除するを選択した場合
      // → ① そのアイテムが最後の１つの時 → カート自体を削除(SWRのローカルキャッシュを更新しているだけ)
      //   ② そのアイテムの他にまだアイテムがある時
      //   ③ 数量を更新する場合
      if(quantity === 0) {
        // ① カート自体を削除 ... SWRのローカルキャッシュを更新しているだけ
        if(cart.cart_items.length === 1) {
          mutateCart(prevCarts => {
            if(!prevCarts) return;

            // 店舗カート自体を削除 → 店舗カートのアイテムが残り1つの時。配列から削除
            return prevCarts.filter(c => c.id !== cart.id);
          }, false); // ローカルのキャッシュのみ更新して、DBから再フェッチしない。
          
          router.push(`/restaurant/${cart.restaurant_id}`);

          return;
        }

        // ② 店舗カートの中のアイテムを削除 → 店舗カートのアイテムが複数
        copyCart.cart_items = copyCart.cart_items.filter((cartItem) => {
          return cartItem.id !== cartItemId; // 削除対象のアイテム以外を取得
        });

        // キャッシュを更新
        mutateCart(prevCarts => { // 画面に反映 = キャッシュを更新
            return prevCarts?.map(cart => {
              return cart.id === copyCart.id ? copyCart : cart;
            })
          }, false);

          return;
        }

        // ③ 数量のみを更新する場合
        copyCart.cart_items = copyCart.cart_items.map(item => {
          return item.id === cartItemId ? { ...item, quantity: quantity } : item
        });

        mutateCart(prevCarts => { // 画面に反映 = キャッシュを更新
          return prevCarts?.map(cart => {
            return cart.id === copyCart.id ? copyCart : cart;
          });
        }, false);
        
    } catch(error) {
      console.error(error);
      alert("エラーが発生しました。");
    }
  }

  // ✅ 注文を確定する処理
  const handleCheckout = async () => {
    try {
      // カートのid
      // 小計と合計はサーバーで計算。クライアントでは悪意のあるユーザーがいる場合があるのでサーバーで計算する
      await checkoutAction(cart.id, fee, service, delivery);

      // カートデータはSWRで管理しているのでキャッシュを更新
      mutateCart(prevCarts => {
        return prevCarts?.filter(prevCart => {
          return prevCart.id !== cart.id; // 注文対象以外のカートを残してキャッシュに保持
        })
      }, false); // 更新後にデータを再フェッチしない

      // ✅ 注文完了ページに移動
      router.push(`/restaurant/${restaurantId}/checkout/complete`);

    } catch(error) {
      console.error(error);
      alert(`注文の確定に失敗しました。${error}`);
    }
  }

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
        <Button 
          className="cursor-pointer"
          onClick={ handleCheckout }
        >
          本ページの内容を確認の上、注文を確定する
        </Button>
      </CardHeader>

      {/* コンテンツ */}
      <CardContent>
        <hr className="my-2" />
        
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>カートの中身{ sumItems(cart.cart_items) }個の商品</AccordionTrigger>
            {
              cart.cart_items.map(cartItem => {
                return (
                  <AccordionContent key={ cartItem.id } className="flex items-center">
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
                        <p className="text-muted-foreground text-sm">￥{ calculateItemTotal(cartItem) }</p>
                      </div>
                    </div>

                    <label htmlFor={`cart-quantity-${cartItem.id}`} className="sr-only">
                      数量
                    </label>
                    <select
                      id={`cart-quantity-${cartItem.id}`}
                      name="quantity"
                      className="border rounded-full pr-8 pl-4 bg-muted h-9"
                      value={ cartItem.quantity }
                      // ✅ 数量変更処理
                      // ① e.target.value → 数値 ② アイテムのid
                      onChange={ (e) => handleUpdateCurtItem(e.target.value, cartItem.id) }
                    >
                      <option value="0">削除する</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </AccordionContent>
                )
              })
            }
          </AccordionItem>
        </Accordion>
      </CardContent>

      {/* 注文の合計 */}
      <CardFooter>
        <div className="w-full">
          <h6 className="font-bold text-xl mb-4">注文の合計額</h6>
          <ul className="grid gap-4">
            <li className="flex justify-between text-muted-foreground">
              <p>小計</p>
              <p>¥{ subtotal }</p>
            </li>
            <li className="flex justify-between text-muted-foreground">
              <div>
                <p>手数料</p>
                { delivery === 0 ? <p className="text-red-500">小計3,500円以上のため送料無料</p> : null }
              </div>
              <p>¥ { fee }</p>
            </li>
            <li className="flex justify-between text-muted-foreground">
              <p>サービス</p>
              <p>¥ { service }</p>
            </li>
            <li className="flex justify-between text-muted-foreground">
              <p>配送料</p>
              <p>¥ { delivery }</p>
            </li>
          </ul>
          <hr className="my-2" />
          <div className="flex justify-between font-medium">
            <p>合計</p>
            <p>¥{ total }</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CartSummary;









