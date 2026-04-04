
// 店舗詳細の検索バー

"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

type MenuSearchBarPropsType = {
  restaurantId: string;
}

export default function MenuSearchBar({ restaurantId }: MenuSearchBarPropsType){
  // console.log(restaurantId);
  const router = useRouter();
  // const pathname = usePathname(); // 👉 クエリパラメータを除いたパスを取得
                                      
  // console.log(pathname); // /restaurant/ChIJw3_kkJMPAWARWvo_pEF1WNM

  const searchParams = useSearchParams(); // 👉 今のURLのクエリパラメータを取得
                                          //    読み取り専用なので今のままでは書き換えできない
  // console.log(searchParams); // ReadonlyURLSearchParams {size: 1}

  // 検索処理を即実行したい場合はステートに保持しない。
  const handleSearchMenu = useDebouncedCallback((inputText: string) => {
  // console.log(inputText);

    // クエリパラメータをセットする準備
    const params = new URLSearchParams(searchParams); // 👉 クエリパラメータをコピーして「編集可能」にする
    // console.log(params); // URLSearchParams {size: 1} ... ⭐️ sessionTokenも入っている

    if(inputText.trim()){
      params.set("searchMenu", inputText); // 👉 クエリパラメータに追加
    } else {
      // バーの文字が全て削除された場合、クエリパラメータを削除
      params.delete("searchMenu");
    }

    // const query = params.toString(); // 👉 クエリパラメータの部分のみを取得
    // console.log(query); // sessionToken=63e33813-4e4a-4030-aac5-9e35c0e4e7ea&searchMenu=ramen

    // ✅ クエリパラメータにurlに反映する
    // toString → 文字列に変換
    router.replace(`/restaurant/${restaurantId}?${params.toString()}`);
    // http://localhost:3000/restaurant/ChIJw3_kkJMPAWARWvo_pEF1WNM?sessionToken=63e33813-4e4a-4030-aac5-9e35c0e4e7ea&searchMenu=コーヒー

  }, 500); // ユーザー操作が終わってから0.5秒後に発火

  return(
    <div className="flex items-center bg-muted rounded-full">
      <Search size={20} color="gray" className="ml-2" />
      <input 
        type="text"
        placeholder="メニューを検索"
        className="flex-1 px-4 py-2 outline-none"
        onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleSearchMenu(e.currentTarget.value)}
      />
    </div>
  )
}





