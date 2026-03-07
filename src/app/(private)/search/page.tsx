

// (private)/search/page.tsx

import { Categories } from "@/components/Categories";
import { RestaurantList } from "@/components/RestaurantList";
import { fetchCategoryRestaurants } from "@/lib/restaurants/api";

type SearchPageProps = {
  searchParams: Promise<{ category: string }>
}

// ✅ サーバーコンポーネントにはデフォルトでクエリパラメータが渡ってくる
export default async function SearchPage({ searchParams }: SearchPageProps){
  // console.log(searchParams);  // ReactPromise {status: 'pending', value: null, reason: null, _children: Array(0), _debugChunk: null, …}
  // const result = await searchParams;
  // console.log(result); // {category: 'fast_food_restaurant'}

  const { category } = await searchParams; // 👉 非同期
  // console.log(category); // fast_food_restaurant
  // → http://localhost:3000/search?category=fast_food_restaurant

  let content;

  if (category) {
    const { data: categoryRestaurants, error: fetchError } = await fetchCategoryRestaurants(category);

    if(!categoryRestaurants) {
      content = <p className="text-destructive">{fetchError}</p>;
    } else if (categoryRestaurants.length > 0) {
      content = <RestaurantList restaurants={categoryRestaurants} />;
    } else {
      content = (
        <p>カテゴリ<strong>{category}</strong>に一致するレストランが見つかりません。</p>
      );
    }
  }

  return (
    <>
      <Categories />
      <div className="mt-5">
        { content }
      </div>
    </>
  )

}