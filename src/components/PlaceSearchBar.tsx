
// ✅ PlaceSearchBar.tsx 検索バー

"use client";

import { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import {
  Calculator,
  Calendar,
  CreditCard,
  MapPin,
  Search,
  Settings,
  Smile,
  User,
} from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { v4 as uuidv4 } from "uuid";
import { RestaurantSuggestionType } from "@/types";


export default function PlaceSearchBar(){
  const [ open, setOpen ] = useState(false);
  const [ inputText, setInputText ] = useState("");
  // ✅ サジェスチョンをAPIで取得する時に使うトークンを作り管理
  //    → Googl側に渡すためのセッションID
  const [ sessionToken, setSessionToken ] = useState(uuidv4());
  // console.log(sessionToken);
  const [ suggestions, setSuggestions ] = useState<RestaurantSuggestionType[]>([]);

  // ✅ 表示されたサジェスチョンを取得するAPI → サーバーサイドでAPIを叩く
  //    セッショントークンも渡す → サジェスチョンを取得するために使う
  // ⭐️ useDebounceCallback → API呼び出しの回数を減らす。
  const fetchSuggestions = useDebouncedCallback(async (_inputText: string) => {
    // try catch文でエラーを捕まえると、error.tsxではハンドリングされない。
    // また、error.tsxは、useEffectのエラーは基本的に捕まえない
    // → useEffectはレンダリング後に実行されるため
    //   ⭐️ 他のAPIはレンダリングプロセス中に実行されるので、error.tsxでハンドリングさせている
    //   onClickなども同じで、try catch文で処理する

    // デバウンスにより遅れてコールバックが実行されるので、文字が空であるならステートを空に
    if(!inputText.trim()) {
      setSuggestions([]);

      return; // 関数を終わらす
    };

    try {
      // console.log("fetchSuggestions!!");
      const response = await fetch(`/api/restaurant/autocomplete?input=${_inputText}&sessionToken=${sessionToken}`);
      // console.log(response);
      const data: RestaurantSuggestionType[] = await response.json();
      // console.log(data);
      // (5) [{type: 'queryPrediction', placeName: 'Pizza Hut'},  {type: 'placePrediction', placeId: 'ChIJqeXxChIFAWARsjoxj1aiThA', placeName: 'KFC'}, {…}, {…}, {…}]
      setSuggestions(data);

    } catch(e) {

    }
  }, 500); // 0.5秒待ってから中のコールバックが発火suru

  // ✅ inputTextの内容が変更するにつれ発火
  useEffect(() => {
    if(!inputText.trim()){ // 検索テキストがない場合。空白は切り取り
      setOpen(false);
      setSuggestions([]); // 👉 検索結果のステートを空に
      // console.log(suggestions);

      return; // 文字を消し終えるとここで関数を終わらす
    }
    setOpen(true);

    fetchSuggestions(inputText);
  }, [ inputText ]);

  const handleBlur = () => setOpen(false); // 別の場所をカーソルを置いた時
  const handleFocus = () => { // フォーカスした時
    // テキストがある場合のみサジェスチョンを開ける。
    if(inputText) setOpen(true);
  };

  return (
    <Command 
      className="max-w-sm rounded-lg border overflow-visible bg-muted"
      shouldFilter={ false } // フィルタリング機能をOFF
    >
      <CommandInput 
        placeholder="Type a command or search..." 
        onValueChange={(_text) => {
          setInputText(_text);
        }}
        onBlur={ handleBlur }
        onFocus={ handleFocus }
        value={ inputText }
      />

      {/* サジェスチョン → テキストを入力した時にだけ表示させる */}
      {
        open && (
          <div className="relative">
            <CommandList className="absolute bg-background w-full shadow-md rounded-lg">
              <CommandEmpty>No results found.</CommandEmpty>
              {/* サジェスションを展開していく */}
              {
                suggestions.map((suggestion) => {
                  // console.log(suggestion);

                  // 検索キーワードはplaceIdを持っていないのでキーは条件分岐でつくる
                  const key = suggestion.placeId ?? `${suggestion.type}-${suggestion.placeName}`;

                  return(
                    <CommandItem 
                      key={ key } 
                      value={ suggestion.placeName }
                      className="p-5"
                    >
                      {/* 実際の店舗はMapPinで、キーワードは虫眼鏡で表す */}
                      { suggestion.type === "queryPrediction" ? <Search /> : <MapPin /> }
                      <p>{ suggestion.placeName }</p>
                    </CommandItem>
                  )
                })
              }
            </CommandList>
          </div>
          
        )
      }
      
    </Command>
  )
}









