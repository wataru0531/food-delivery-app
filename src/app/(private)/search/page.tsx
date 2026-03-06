

// (private)/search/page.tsx

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


  // ⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから
  // ⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから
  // ⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから
  // ✅ カテゴリーに応じたデータを取得する
  if(category){
    // fetchCategoryRestaurants(category);
  }

  return(
    <div>SearchPage</div>
  )
}


