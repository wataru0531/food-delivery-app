
// 注文完了ページ
// restaurant/[restaurantId]/checkout/complete/page.tsx

import DeliveryAnimation from "@/components/DeliveryAnimation";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default async function CheckoutCompletePage(){
  return(
    <div className="flex flex-col items-center justify-center min-h-[calc(100svh-64px)]">
      <h1 className="text-3xl font-bold">ご注文の商品を準備しています.</h1>

      <DeliveryAnimation />

      <Button size={"lg"}>
        <Link href={"/orders"}>注文履歴へ</Link>
      </Button>

    </div>
  )
} 




