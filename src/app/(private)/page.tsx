
// (private)/page.tsx
// → ログイン後の画面を入れていく

import CarouselContainer from "@/components/CarouselContainer";
import RestaurantCard from "@/components/RestaurantCard";
import Section from "@/components/Section";
import { fetchRamenRestaurants } from "@/lib/restaurants/api";


export default async function Home() {
  const { data: nearbyRamenRestaurants, error } = await fetchRamenRestaurants();
  // console.log(nearbyRamenRestaurants, error); // {places: Array(2)} undefined

  return (
    <>
      {
        !nearbyRamenRestaurants ? (
          <p>{ error }</p>
        ) : nearbyRamenRestaurants.length > 0 ? ( // ラーメン店がある場合
            <Section title="近くのお店">
              <CarouselContainer slideToShow={4}>
                {
                  nearbyRamenRestaurants.map((restaurant, idx) => (
                    <RestaurantCard key={ idx } restaurant={ restaurant } />
                  ))
                }
              </CarouselContainer>
              <div>scroll_area</div>
            </Section>
        ) : (
          // ラーメン店がない場合 → 空オブジェクトの時
          <p>近くにラーメン店がありません。</p>
        )
      }
    </>
    
  );
}
