
// (private)/page.tsx
// → ログイン後の画面を入れていく

import type { Metadata } from "next";

import CarouselContainer from "@/components/CarouselContainer";
import { Categories } from "@/components/Categories";
import RestaurantCard from "@/components/RestaurantCard";
import { RestaurantList } from "@/components/RestaurantList";
import Section from "@/components/Section";
import { fetchLocation, fetchRamenRestaurants, fetchRestaurants } from "@/lib/restaurants/api";

// layoutと同じなら書かなくて良い。継承される。
export const metadata: Metadata = {
  title: "Food Delivery Service",
  description: "Find nearby restaurants and ramen shops quickly. Discover great food around you with our food delivery service.",
}


export default async function Home() {
  const { lat, lng } = await fetchLocation(); // 👉 選択中の住所の緯度と経度を取得
  // console.log(lat, lng); // 34.964756 135.7693602

  // ✅ ラーメン店
  const { data: nearbyRamenRestaurants, error: nearbyRamenRestaurantsError } = await fetchRamenRestaurants(lat, lng);
  // console.log(nearbyRamenRestaurants, error); // {places: Array(2)} undefined

  // ✅ レストラン
  const { data: nearbyRestaurants, error: nearbyRestaurantsError } = await fetchRestaurants(lat, lng);
  // console.log(nearbyRestaurants);
  // (10) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, _debugInfo: Array(1)]

  return (
    <>
      {/* ✅ カテゴリーのコンテナ */}
      <Categories />

      {/* ✅ レストラン(ラーメン店含む) */}
      {
        !nearbyRestaurants ? (
          <p>{ nearbyRestaurantsError }</p>
        ) : nearbyRestaurants.length > 0 ? (
          <Section 
            title="近くのレストラン"
            expandedContent={ <RestaurantList restaurants={ nearbyRestaurants } /> }
          >
            <CarouselContainer slideToShow={4}>
              {
                nearbyRestaurants.map((restaurant, idx) => (
                  <RestaurantCard key={ idx } restaurant={ restaurant } />
                ))
              }
            </CarouselContainer>
          </Section>
        ) : (
          <p>近くにレストランがありません。</p>
        )
      }

      {/* ✅ ラーメン店 */}
      {
        !nearbyRamenRestaurants ? (
          <p>{ nearbyRamenRestaurantsError }</p>
        ) : nearbyRamenRestaurants.length > 0 ? ( // ラーメン店がある場合
            <Section 
              title="近くのラーメン店" 
              expandedContent={<RestaurantList restaurants={ nearbyRamenRestaurants } />} // リスト表示の時に使う
            >
              <CarouselContainer slideToShow={4}>
                {
                  nearbyRamenRestaurants.map((restaurant, idx) => (
                    <RestaurantCard key={ idx } restaurant={ restaurant } />
                  ))
                }
              </CarouselContainer>
            </Section>
        ) : (
          // ラーメン店がない場合 → 空オブジェクトの時
          <p>近くにラーメン店がありません。</p>
        )
      }
    </>
    
  );
}
