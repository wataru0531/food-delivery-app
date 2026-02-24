
// (private)/page.tsx
// → ログイン後の画面を入れていく

import CarouselContainer from "@/components/CarouselContainer";
import RestaurantCard from "@/components/RestaurantCard";
import Section from "@/components/Section";


export default function Home() {
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
