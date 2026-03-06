
// ✅

"use client";
// → 関数を定義する場合もクライアントコンポーネントする
//   ... 関数はフロントに送られないため

import { useSearchParams, useRouter } from "next/navigation";

import CarouselContainer from "./CarouselContainer";
import { Category } from "./Category";

export type CategoryType = {
  categoryName: string;
  type: string;
  imageUrl: string;
}

export function Categories(){
  const searchParams = useSearchParams();
  // console.log(searchParams); // ReadonlyURLSearchParams {size: 0}
  const router = useRouter();

  const categories: CategoryType[] = [
    {
      categoryName: "ファーストフード",
      type: "fast_food_restaurant",
      imageUrl: "/images/categories/ファーストフード.png",
    },
    {
      categoryName: "日本料理",
      type: "japanese_restaurant",
      imageUrl: "/images/categories/日本料理.png",
    },
    {
      categoryName: "ラーメン",
      type: "ramen_restaurant",
      imageUrl: "/images/categories/ラーメン.png",
    },
    {
      categoryName: "寿司",
      type: "sushi_restaurant",
      imageUrl: "/images/categories/寿司.png",
    },
    {
      categoryName: "中華料理",
      type: "chinese_restaurant",
      imageUrl: "/images/categories/中華料理.png",
    },
    {
      categoryName: "コーヒ-",
      type: "cafe",
      imageUrl: "/images/categories/コーヒー.png",
    },
    {
      categoryName: "イタリアン",
      type: "italian_restaurant",
      imageUrl: "/images/categories/イタリアン.png",
    },
    {
      categoryName: "フランス料理",
      type: "french_restaurant",
      imageUrl: "/images/categories/フレンチ.png",
    },

    {
      categoryName: "ピザ",
      type: "pizza_restaurant",
      imageUrl: "/images/categories/ピザ.png",
    },

    {
      categoryName: "韓国料理",
      type: "korean_restaurant",
      imageUrl: "/images/categories/韓国料理.png",
    },
    {
      categoryName: "インド料理",
      type: "indian_restaurant",
      imageUrl: "/images/categories/インド料理.png",
    },
  ];
  // {
  //   categoryName: "ファーストフード",
  //   type: "fast_food_restaurant",
  //   imageUrl: "/images/categories/ファーストフード.png",
  // },

  // ✅ カテゴリーをクリックした時の処理
  //    → typeをクエリパラメータに渡す
  const searchRestaurant = (_category: string) => {
    // console.log(_category); // fast_food_restaurant, japanese_restaurant

    // クエリパラメータを設定しておく → 後から実際のurlに反映する
    const params = new URLSearchParams(searchParams);
    params.set("category", _category); // 👉 クエリパラメータを追加。urlには表示されない

    // console.log(params); // URLSearchParams {size: 1}
    
    // replace → 今のurlから履歴を置き換える。... ブラウザバックで元のurlに戻れない
    //           ここでは履歴を増やさないようにしている？
    // push → 新しい履歴を追加してページ遷移させる。... ブラウザバックが可能
    router.replace(`/search?${params.toString()}`); 
    // → http://localhost:3000/search?category=fast_food_restaurant
  
  }

  return(
    <CarouselContainer slideToShow={10}>
      { 
        categories.map(category => (
          <Category 
            key={category.categoryName} 
            category={ category }
            onClick={ searchRestaurant }
          />
        ))
      }
    </CarouselContainer>
  )
}




