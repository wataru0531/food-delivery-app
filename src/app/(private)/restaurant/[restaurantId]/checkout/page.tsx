

// (private)/restaurant/[restaurant]/checkout/page.tsx
// 注文ページ
// http://localhost:3000/restaurant/ChIJK6kOh-LfAGARdOxPses4qXU/checkout

import AddressModal from "@/components/AddressModal";
import CartSummary from "@/components/CartSummary";
import PaymentModal from "@/components/PaymentModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, Briefcase } from "lucide-react";

type CheckoutPageType = {
  params: Promise<{ restaurantId: string }>
}

export default async function CheckoutPage({ params }: CheckoutPageType) {
  // console.log(params); // ReactPromise {status: 'pending', value: null, reason: null, _children: Array(0), _debugChunk: null, …}
  const { restaurantId } = await params; // → [restaurantId]フォルダのrestaurantIdが渡ってくる
  // console.log(result); // { restaurantId: 'ChIJK6kOh-LfAGARdOxPses4qXU' }


  return (
    <div className="flex gap-4 p-10">
      {/* 左側エリア */}
      <div className="max-w-3xl space-y-4 flex-1">
        <Card>
          <CardHeader>
            <CardTitle>配達の詳細</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-4">
              <Briefcase />
              <AddressModal />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>お支払い</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-4">
              <Banknote />
              <PaymentModal />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 右側エリア */}
      <CartSummary restaurantId={ restaurantId } />
    </div>
  );
}
