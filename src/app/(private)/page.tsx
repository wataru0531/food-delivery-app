
// (private)/page.tsx
// → ログイン後の画面を入れていく

import CarouselContainer from "@/components/CarouselContainer";
import RestaurantCard from "@/components/RestaurantCard";
import Section from "@/components/Section";
import { fetchRamenRestaurants } from "@/lib/restautants/api";


export default async function Home() {
  // const data = await fetchRamenRestaurants();

  const res = await fetch("http://localhost:3000/api/places", {
    next: { revalidate: 86400 }, // ← ここでもOK（どちらかでOK）
  });

  // const data = await res.json();

  return (
    <Section title="近くのお店">
      <CarouselContainer slideToShow={4}>
        {
          Array.from({ length: 5 }).map((_, idx) => (
            <RestaurantCard key={ idx }/>
          ))
        }
      </CarouselContainer>

      <div>scroll_area</div>
    </Section>
  );
}
