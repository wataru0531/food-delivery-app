
// (private)/page.tsx
// → ログイン後の画面を入れていく

import type { Metadata } from "next";
import Link from "next/link";

import CarouselContainer from "@/components/CarouselContainer";
import { Categories } from "@/components/Categories";
import RestaurantCard from "@/components/RestaurantCard";
import { RestaurantList } from "@/components/RestaurantList";
import Section from "@/components/Section";
import { fetchLocation, fetchRamenRestaurants, fetchRestaurants } from "@/lib/restaurants/api";
import { fetchMenus } from "@/lib/menus/api";
import MenuList from "@/components/MenuList";
import MenuClient from "@/components/MenuClient";

// layoutと同じなら書かなくて良い。継承される。
export const metadata: Metadata = {
  title: "Food Delivery Service",
  description: "Find nearby restaurants and ramen shops quickly. Discover great food around you with our food delivery service.",
}


export default async function Home() {
  const { lat, lng } = await fetchLocation(); // 👉 選択中の住所の緯度と経度を取得
  // console.log(lat, lng); // 34.964756 135.7693602

  // ✅ レストラン
  const { data: nearbyRestaurants, error: nearbyRestaurantsError } = await fetchRestaurants(lat, lng);
  // console.log(nearbyRestaurants);
  // (10) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, _debugInfo: Array(1)]

  // ✅ 近くのラーメン店
  const { data: nearbyRamenRestaurants, error: nearbyRamenRestaurantsError } = await fetchRamenRestaurants(lat, lng);
  // console.log(nearbyRamenRestaurants, nearbyRamenRestaurantsError); // {places: Array(2)} undefined

  const restaurant = nearbyRamenRestaurants?.[0]; // 最初のラーメン店のデータ
  const primaryType = restaurant?.primaryType;
  // console.log(primaryType); //  ramen_restaurant

  // // ✅ 近くのラーメン店の配列の最初のデータ
  const { data: menus, error: menusError } = primaryType ? await fetchMenus(primaryType) 
                                                        : { data: [] }
  // console.log(menus); // (22) [{…}, {…}, ...]

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

      {/* ラーメン店のprimaryTypeと同じメニューを取得 */}
      {
        !menus ? (
          <p>{ menusError }</p>
        ) : menus.length > 0 && restaurant ? (
          <Section 
            title={ restaurant.restaurantName + "(ラーメン店配列の最初のお店のメニュー)" }
            expandedContent={<MenuList menus={ menus } restaurantId={ restaurant.id } />} // リスト表示用コンポーネント
          >
            <MenuClient menus={ menus } restaurantId={ restaurant.id }/>
          </Section>
        ) : (
          <p>メニューがありません</p>
        )
      }
    </>
  );
}