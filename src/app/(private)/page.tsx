
// (private)/page.tsx
// → ログイン後の画面を入れていく

import CarouselContainer from "@/components/CarouselContainer";
import RestaurantCard from "@/components/RestaurantCard";
import Section from "@/components/Section";
import { fetchRamenRestaurants, fetchRestaurants } from "@/lib/restaurants/api";


export default async function Home() {
  const { data: nearbyRamenRestaurants, error: nearbyRamenRestaurantsError } = await fetchRamenRestaurants();
  // console.log(nearbyRamenRestaurants, error); // {places: Array(2)} undefined

  const { data: nearbyRestaurants, error: nearbyRestaurantsError } = await fetchRestaurants();
  // console.log(nearbyRestaurants);
  // (10) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, _debugInfo: Array(1)]

  return (
    <>
      {/* ✅ ラーメン店 */}
      {
        !nearbyRamenRestaurants ? (
          <p>{ nearbyRamenRestaurantsError }</p>
        ) : nearbyRamenRestaurants.length > 0 ? ( // ラーメン店がある場合
            <Section title="近くのラーメン店">
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

      {/* ✅ レストラン(ラーメン店含む) */}
      {
        !nearbyRestaurants ? (
          <p>{ nearbyRestaurantsError }</p>
        ) : nearbyRestaurants.length > 0 ? (
          <Section title="近くのレストラン">
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
    </>
    
  );
}
