

// OrderCard.tsx


import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

import { OrderType } from "@/types"

type OrderCartProps = {
  order: OrderType;
}

export default function OrderCard({ order }: OrderCartProps) {
  // console.log(order);
    // {
    //     id: 41,
    //     restaurant_id: 'ChIJK6kOh-LfAGARdOxPses4qXU',
    //     created_at: '2026-05-01T08:13:35.387445+00:00',
    //     fee: 0,
    //     service: 0,
    //     delivery: 410,
    //     subtotal_price: 3400,
    //     total_price: 3810,
    //     restaurantName: '中華料理 龍虎',
    //     photoUrl: '/no-image.jpeg'
    //   }
    // 👉 order_itemsは、order_itemsテーブルからデータが取得できないため入れられない

    // const iso = order.created_at;
    // console.log(iso); // 2026-05-04T07:56:26.801333+00:00 → ISO8601形式 
    // const date = iso.slice(0, 10);
    // console.log(date); // 2026-05-02


  return (
    <>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative size-16 rounded-full overflow-hidden flex-none">
              <Image
                src={ order.photoUrl ?? "/no_image.png"}
                alt={"レストラン画像"}
                fill
                className="object-cover w-full h-full"
                sizes="64px"
              />
            </div>
            <div>
              {/* 
                toLocaleDateString → その環境（ユーザーの地域）に合わせた“日付表示用の文字列”に変換する」メソッド
                                      ... その人の国に合わせた日付表示
              */}
              <CardDescription>{ new Date(order.created_at).toLocaleDateString() }</CardDescription>
              <CardTitle>{ order.restaurantName }</CardTitle>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href={`/restaurant/${order.restaurant_id}`}>店舗情報を表示</Link>
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 
            ✅ order_itemsテーブルにアクセスできないので何も記述なし  
          */}
          <div className="flex items-center justify-between border-b pb-4 last:border-b-0">
            <div className="flex items-center gap-4">
              <div className="relative size-16 rounded-md overflow-hidden flex-none">
                <Image
                  src={"/no_image.png"}
                  alt={"メニュー画像"}
                  fill
                  className="object-cover w-full h-full"
                  sizes="64px"
                />
              </div>
              <div>
                <div className="font-medium">メニュー名</div>
                <div className="text-muted-foreground">¥#</div>
              </div>
            </div>
            <div className="text-right">
              <div>#個</div>
              <div>¥#</div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-1">
          <div className="w-full border-t pt-4 space-y-1 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>小計</span>
              <span>¥{ order.subtotal_price }</span>
            </div>

            {
              order.fee > 0 && (
                <div className="flex justify-between">
                  <span>手数料</span>
                  <span>¥{ order.fee }</span>
                </div>
              )
            }
            {
              order.service > 0 && (
                  <div className="flex justify-between">
                    <span>サービス</span>
                    <span>¥{ order.service }</span>
                  </div>
              )
            }
            {
              order.delivery > 0 && (
                  <div className="flex justify-between">
                    <span>配達料</span>
                    <span>¥{ order.delivery }</span>
                  </div>
              )
            }
          </div>
          <div className="flex justify-between w-full font-bold pt-2">
            <span>合計</span>
            <span>¥{ order.total_price }</span>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
