
// ✅　カテゴリ検索(ヘッダー上部に並ぶカテゴリークリック時)のページ、キーワード検索のページ を兼任
// (private)/search/page.tsx

import { redirect } from "next/navigation";

import { Categories } from "@/components/Categories";
import { RestaurantList } from "@/components/RestaurantList";
import { fetchCategoryRestaurants, fetchLocation, fetchRestaurantsByKeyword } from "@/lib/restaurants/api";

type SearchPageProps = {
  searchParams: Promise<{ category: string, restaurant: string }>
}

// ✅ サーバーコンポーネントにはデフォルトでクエリパラメータが渡ってくる
export default async function SearchPage({ searchParams }: SearchPageProps){
  const { lat, lng } = await fetchLocation();

  // console.log(searchParams);  // ReactPromise {status: 'pending', value: null, reason: null, _children: Array(0), _debugChunk: null, …}
  // const result = await searchParams;
  // console.log(result); // {category: 'fast_food_restaurant'}

  const { category, restaurant } = await searchParams; // 👉 非同期
  // console.log(category); // fast_food_restaurant → カテゴリーからの選択
  // → http://localhost:3000/search?category=fast_food_restaurant
  // console.log(restaurant); // そば → 検索キーワードによる
  // console.log(category, restaurant);

  let content;

  if (category) {
    // console.log("category in!!"); // 👉 カテゴリークリック
    const { data: categoryRestaurants, error: fetchError } = await fetchCategoryRestaurants(category, lat, lng);

    if(!categoryRestaurants) {
      content = <p className="text-destructive">{fetchError}</p>;
    } else if (categoryRestaurants.length > 0) {
      content = <RestaurantList restaurants={categoryRestaurants} />;
    } else {
      content = (
        <p>カテゴリ<strong>{category}</strong>に一致するレストランが見つかりません。</p>
      );
    }
  } else if(restaurant) {
    // console.log("restaurant in!!"); // 👉 検索キーワードをクリック
    const { data: restaurants, error: fetchError } = await fetchRestaurantsByKeyword(restaurant, lat, lng);
    // console.log(restaurants); // (10) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, _debugInfo: Array(1)]
    
    if(!restaurants) {
      content = <p className="text-destructive">{ fetchError }</p>
    } else if(restaurants.length > 0) {
      content = (
        <>
          <div>{ restaurant } の検索結果 { restaurants.length } 件の結果</div>
          <RestaurantList restaurants={ restaurants } />
        </>
      );
    } else {
      content = (
        <p>検索キーワード「<strong>{ restaurant }</strong>」に一致するレストランが見つかりません。</p>
      )
    }
  } else {
    // http://localhost:3000/search など、クエリパラメータの設定がない場合
    redirect("/");
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