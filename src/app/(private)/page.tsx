
// (private)/page.tsx
// → ログイン後の画面を入れていく

import CarouselContainer from "@/components/CarouselContainer";
import RestaurantCard from "@/components/RestaurantCard";
import Section from "@/components/Section";
// import { fetchRamenRestaurants } from "@/lib/restautants/api";


export default async function Home() {
  // const data = await fetchRamenRestaurants();

  const res = await fetch("http://localhost:3000/api/places", {
    // cache: "force-cache", // デフォルト。可能ならキャッシュを使う。静的データ向き
                             // 一回データを取ったら使い回す 
    // cache: "no-store", // キャッシュを使わない
                          // 毎回必ず最新データを取得
                          // 完全にキャッシュしない
                          // 動的データ向き（ログイン、検索、ランキングなど）
    next: { revalidate: 86400 } // 24時間でキャッシュ。24時間後にキャッシュを再取得
  });

  const data = await res.json();
  // const data = await res.text();
  console.log(data);

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
