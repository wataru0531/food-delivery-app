
// ✅ サジェスチョンで指定した店舗の詳細ページ

import { Button } from "@/components/ui/button"
import { getPlaceDetails } from "@/lib/restaurants/api"
import { Heart } from "lucide-react"
import Image from "next/image"


// type propsType = {
//   restaurant: string
// }

// ✅ metadata
//    → layoutの %s に入るtitleを設定 → "ここでのtitle | layoutのtitleのtemplate"
// export async function generateMetadata({ params }: propsType) {
//   // console.log(params);


//   return {
//     title: `店舗詳細`,
//   }
// }


type RestaurantPageProps = {
  params: Promise<{restaurantId: string}>;  // → 非同期で渡ってくるのでPromiseを指定
  searchParams: Promise<{sessionToken: string}>;
}

export default async function RestaurantPage({params, searchParams}: RestaurantPageProps){
  const { restaurantId } = await params; // urlのパラメータ(=フォルダ名の[restaurantId]の部分を取得
  const { sessionToken } = await searchParams; // クエリパラメータの値を取得
  // console.log(restaurantId, sessionToken); // ChIJjSyqgoMFAWARCxyYj8IxB54, bf4c9bac-12fd-4c4d-a0c3-155f54f8dc0d

  const { data: { displayName, primaryType, photoUrl }, error } = await getPlaceDetails(restaurantId, ["displayName","photos","primaryType"], sessionToken);
  // console.log(displayName, primaryType, photoUrl); // ラーメン銀閣, ramen_restaurant, https://places.googleapis.com/v1/places/ChIJjSyqgoMFAWARCx... 

  return(
    <div>
      <div className="h-64 rounded-xl shadow-md relative overflow-hidden">
        <Image
          src={photoUrl!}
          fill
          alt={"レストラン画像"}
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
          <h1 className="text-3xl font-bold">{ displayName! }</h1>
        </div>
        <div className="flex-1">
          <div className="ml-auto w-80 bg-yellow-300">検索バー</div>
        </div>
      </div>
    </div>
  )
}