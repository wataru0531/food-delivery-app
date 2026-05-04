


// 注文履歴ページ

import OrderCard from "@/components/OrderCard";
import { fetchOrders } from "@/lib/orders/api";


export default async function OrdersPage(){
  const orders = await fetchOrders();
  // console.log(orders);
  // [
  //   {
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
  //   },
  //   ...
  // ]
  // 👉 order_itemsは、order_itemsテーブルからデータが取得できないため入れられない

  if(orders.length === 0) {
    return <div className="">注文履歴がありません。</div>
  }

  return(
    <div className="space-y-6">
      {
        orders.map(order => (
          <OrderCard key={ order.id } order={ order }/>
        ))
      }
    </div>
  )
}