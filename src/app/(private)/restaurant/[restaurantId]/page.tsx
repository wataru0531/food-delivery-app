
// ✅ サジェスチョンで指定した店舗の詳細ページ

import { Button } from "@/components/ui/button"
import MenuContent from "@/components/ui/MenuContent";
import { fetchCategoryMenus } from "@/lib/menus/api";
import { getPlaceDetails } from "@/lib/restaurants/api"
import { Heart } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation";

type propsType = {
  params: Promise<{ restaurantId: string }>
  searchParams: Promise<{sessionToken: string}>;
}

// ✅ metadata
//    → layoutの %s に入るtitleを設定 → "ここでのtitle | layoutのtitleのtemplate"
export async function generateMetadata({ params, searchParams }: propsType) {
  // console.log(params); // ReactPromise {status: 'pending', value: null, reason: null, _children: Array(0), _debugChunk: null, …}
  const { restaurantId } = await params;
  // console.log(restaurantId); // ChIJvw5w9L0FAWARmQIeaRucmeE
  const { sessionToken } = await searchParams; 
  // console.log(sessionToken); // d125d3ca-ccac-4289-ae30-d14a56b8f129

  const { data: restaurant } = await getPlaceDetails(restaurantId, ["displayName"], sessionToken);
  // console.log(restaurant); // {displayName: 'RAMEN KATAMUKI（ラーメン カタムキ）Chicken & Vegan noodles shop'}

  return {
    title: restaurant?.displayName ?? "店舗名",
    description: "店舗詳細ページ。Google Places new にはdescriptionがない"
  }
}

type RestaurantPageProps = {
  params: Promise<{restaurantId: string}>;  // → 非同期で渡ってくるのでPromiseを指定
  searchParams: Promise<{sessionToken: string}>;
}


// 
export default async function RestaurantPage({params, searchParams}: RestaurantPageProps){
  const { restaurantId } = await params; // urlのパラメータ(=フォルダ名の[restaurantId]の部分を取得
  const { sessionToken } = await searchParams; // クエリパラメータの値を取得
  // console.log(restaurantId, sessionToken); // ChIJjSyqgoMFAWARCxyYj8IxB54, bf4c9bac-12fd-4c4d-a0c3-155f54f8dc0d

  const { data: restaurant, error } = await getPlaceDetails(restaurantId, ["displayName","photos","primaryType"], sessionToken);
  // console.log(restaurant); // { displayName: 'ラーメン銀閣', primaryType: 'ramen_restaurant', photoUrl: 'https://places.googleapis.com/v1/places/ChIJjSyqgo…yBa8qlrcwFyauWD-CE8Uopl7FsQP0oSjvI&maxWidthPx=400'}

  const primaryType = restaurant?.primaryType; // 店舗の種別
  // console.log(p_rimaryType);

  // ✅ 店舗の種別(primaryType)に応じたメニューを取得
  const { data: categoryMenus, error: menusError } = primaryType ? await fetchCategoryMenus(primaryType)
                                                                : { data: [] };
  // console.log(categoryMenus); // (4) [{id: 'featured', categoryName: '注目商品', items: Array(8)}, {…}, {…},

  if(error) notFound();
  if(!restaurant?.photoUrl) throw new Error("photoUrlがありません。");
  if(!restaurant?.displayName) throw new Error("displayNameがありません。")

  return(
    <>
      <div>
        <div className="h-64 rounded-xl shadow-md relative overflow-hidden">
          <Image
            src={restaurant.photoUrl}
            fill
            alt={ restaurant.displayName ?? "店舗画像" }
            className="object-cover"
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <Button 
            size="icon"
            variant="outline"
            className="absolute top-4 right-4 shadow rounded-full"
          >
            <Heart color="gray" strokeWidth={3} size={15} />
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{ restaurant.displayName }</h1>
          </div>
          <div className="flex-1">
            <div className="ml-auto w-80 bg-yellow-300">検索バー</div>
          </div>
        </div>
      </div>

      {
        !categoryMenus ? (
          <p>{ menusError }</p>
        ) : categoryMenus.length > 0 ? (
          <MenuContent categoryMenus={ categoryMenus } />
        ) : (
          <p>メニューがありません。</p>
        )
      }
    </>
  )
}