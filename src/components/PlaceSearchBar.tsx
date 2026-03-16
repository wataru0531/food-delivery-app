
// ✅ PlaceSearchBar.tsx 検索バー

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  AlertCircle,
  LoaderCircle,
  MapPin,
  Search,
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
  const [ isLoading, setIsLoading ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState<string | null>(null);
  const clickedOnItem = useRef(false); // 👉 useRefで定義した変数は再レンダリングしても保持される。
  const router = useRouter();

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
    if(!_inputText.trim()) {
      setSuggestions([]);

      return; // 関数を終わらす
    };

    setErrorMessage(null); // エラーメッセージの初期化

    try {
      // console.log("fetchSuggestions!!");
      const response = await fetch(`/api/restaurant/autocomplete?input=${_inputText}&sessionToken=${sessionToken}`);
      // console.log(response);

      // dataが取れてきていない時の処理
      // 👉 エラーの400番台や500番台が返ってきた時にここが実行される
      if(!response.ok) { 
        const errorData = await response.json();
        setErrorMessage(errorData.error);

        return; // 処理中断
      }

      const data: RestaurantSuggestionType[] = await response.json();
      // console.log(data);
      // (5) [{type: 'queryPrediction', placeName: 'Pizza Hut'},  {type: 'placePrediction', placeId: 'ChIJqeXxChIFAWARsjoxj1aiThA', placeName: 'KFC'}, {…}, {…}, {…}]
      setSuggestions(data);

    } catch(error) {
      console.error(error);
      setErrorMessage("予期せぬエラーが起きました。")
    } finally {
      setIsLoading(false);
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
    setIsLoading(true); // ローディングをtrueに
    setOpen(true);

    fetchSuggestions(inputText);
  }, [ inputText ]);

  // 別の場所をカーソルを置いた時にはサジェスチョンは閉じる
  // ✅ 一度、対象DOMからカーソルが外れたら、他のDOMをクリックしてもonBlurは発火しない
  const handleBlur = () => {
    if(clickedOnItem.current) { // CommandItemをクリックした時は閉じない。
      clickedOnItem.current = false; // 閉じれなくなるので元に戻す
      return; 
    }
    
    setOpen(false);
  }; 

  const handleFocus = () => { // フォーカスした時
    // テキストがある場合のみサジェスチョンを開ける。
    if(inputText) setOpen(true);
  };

  // ✅　サジェスチョンをクリックした時の処理
  // → キーワードで検索したページ、検出できた店舗かの2つの詳細ページに遷移
  const handleSelectSuggestion = (suggestion: RestaurantSuggestionType) => {
    // console.log(suggestion); // 店舗 → {type: 'placePrediction', placeId: 'ChIJby1ukkIEAWARIHrJMqfIwIw', placeName: '済公亭'}
                             // キーワード → {type: 'queryPrediction', placeName: 'restaurants'}

    if(suggestion.type === "placePrediction") {
      // ✅ 店舗を選択した場合 → idとセッショントークンを渡す。
      //                      店舗詳細ページに遷移
      router.push(`/restaurant/${suggestion.placeId}?sessionToken=${sessionToken}`);
    
      setSessionToken(uuidv4()); // 次の検索のために新しいトークンを作る必要がある
                                // →  更新しないとGoogleから見ると全て同じ検索行動に見えるので検索最適化が行われない
    } else {
      // ✅ キーワード検索のサジェスチョンを選択した時
      //    → 検索結果ページに遷移
      router.push(`/search?restaurant=${suggestion.placeName}`);
      // 👉 キーワード検索の場合は、検索の途中なのでセッションの更新はしない
    }

    setOpen(false);
  } 

  // ✅ キーワード検索
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if(!inputText.trim()) return;

    if(e.key === "Enter") {
      router.push(`/search?restaurant=${inputText}`);
      setOpen(false);
    }
    
  }

  return (
    <Command 
      className="max-w-sm rounded-lg border overflow-visible bg-muted"
      shouldFilter={ false } // フィルタリング機能をOFF
      onKeyDown={ handleKeyDown } // キーワード検索
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
              {/*
                CommandEmpty → 検索結果が0件の時に表示するUI
                                suggestionsの配列に何も入っていない時
              */}
              <CommandEmpty>
                <div className="flex items-center justify-center">
                  { 
                    isLoading ? <LoaderCircle className="animate-spin" /> 
                              : errorMessage ? (
                                  <div className="flex items-center text-destructive gap-2">
                                    <AlertCircle /> 
                                    { errorMessage }
                                  </div>
                                ) 
                              : (
                                "レストランがありません。"
                              )
                  }
                </div>
              </CommandEmpty>

              {/* サジェスションを表示 */}
              {
                suggestions.map((suggestion) => {
                  // console.log(suggestion);
                  // 検索キーワードはplaceIdを持っていないのでキーは条件分岐でつくる
                  const key = suggestion.placeId ?? `${suggestion.type}-${suggestion.placeName}`;

                  return(
                    <CommandItem 
                      key={ key } 
                      value={ suggestion.placeName }
                      onSelect={ () => handleSelectSuggestion(suggestion) }
                      onMouseDown={ () => clickedOnItem.current = true }
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









