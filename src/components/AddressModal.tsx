
// ✅ 住所に関するモーダル

"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useDebouncedCallback } from "use-debounce";
import { AddressSuggestionType } from "@/types";
import { AlertCircle, LoaderCircle, MapPin } from "lucide-react";
import { selectSuggestionAction } from "@/app/(private)/actions/addressActions";


export default function AddressModal(){
  const [ inputText, setInputText ] = useState("");
  const [ sessionToken, setSessionToken ] = useState(uuidv4());
  // console.log(sessionToken);

  const [ suggestions, setSuggestions ] = useState<AddressSuggestionType[]>([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState<string | null>(null);


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
      // ✅ 住所情報を取得 ルートハンドラーを発火
      const response = await fetch(`/api/address/autocomplete?input=${_inputText}&sessionToken=${sessionToken}`);
      // console.log(response);

      // dataが取れてきていない時の処理
      // 👉 エラーの400番台や500番台が返ってきた時にここが実行される
      if(!response.ok) { 
        const errorData = await response.json();
        setErrorMessage(errorData.error);

        return; // 処理中断
      }

      const data: AddressSuggestionType[] = await response.json();
      // console.log(data); // (5) [{placeId: 'ChIJFerB-HoFAWAR5uaYr9yg7Ns', placeName: 'びっくりドンキー 伏見店', address_text: '京都府京都市伏見区下鳥羽広長町１５９'}, {…}, {…}, {…}, {…}]

      setSuggestions(data);

    } catch(error) {
      console.error(error);
      setErrorMessage("予期せぬエラーが起きました。")
    } finally {
      setIsLoading(false);
    }

  }, 500); // 0.5秒待ってから中のコールバックが発火
  
  // ✅ inputTextの内容が変更するにつれ発火
  useEffect(() => {
    if(!inputText.trim()){ // 検索テキストがない場合。空白は切り取り
      // setOpen(false);
      setSuggestions([]); // 👉 検索結果のステートを空に
      // console.log(suggestions);

      return; // 文字を消し終えるとここで関数を終わらす
    }
    setIsLoading(true); // ローディングをtrueに
    // setOpen(true);

    fetchSuggestions(inputText);
  }, [ inputText ]);

  // ✅ サジェスチョンを選択した時の処理
  const handleSelectSuggestion = async (suggestion: AddressSuggestionType) => {
    // console.log(suggestion); // {placeId: 'ChIJ222NUgAJAWARiFvAjMyIalo', placeName: 'RAMEN KATAMUKI（ラーメン カタムキ）Chicken & Vegan noodles shop', address_text: '京都府京都市下京区稲荷町４４８'}
    
    // ✅ サーバーアクション
    // ⭐️ クライアントコンポーネントではerror.tsxでは捕まえられない。
    // → error.tsxはレンダリング中に発生したエラーしか監視していないため。
    //   クライアント、サーバーのどちらでも動くが、React内部でのレンダリング中のエラーのみ捕まえる
    try {
      await selectSuggestionAction(suggestion, sessionToken);

      setSessionToken(uuidv4()); // トークンを更新。使いまわすことができないため。

    } catch(e) {
      alert("予期せぬエラーが発生しました。");
    }
  
  }

  return(
    <Dialog>
      <DialogTrigger>住所を選択</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>住所</DialogTitle>
          <DialogDescription className="sr-only">住所登録と選択</DialogDescription>
        </DialogHeader>

        <Command shouldFilter={ false }>  {/* フィルタリング機能を停止  */}
          <div className="bg-muted mb-4">
            <CommandInput
              value={ inputText }
              onValueChange={(text) => setInputText(text)}
              placeholder="Type a command or search..." 
            />
          </div>

          <CommandList>
            {
              inputText ? (
                // サジェスチョン表示
                <>
                  {/* CommandItemが1つもない場合に内部で自動に表示されるUI */}
                  <CommandEmpty>
                    <div className="flex items-center justify-center">
                      {
                        isLoading ? ( <LoaderCircle className="animate-spin" /> ) 
                                  : errorMessage ? (
                                    <>
                                      <AlertCircle  />
                                      { errorMessage }
                                    </>
                                  ) : 
                                  (
                                    <p>住所が見つかりません。</p>
                                  )
                      }
                    </div>
                  </CommandEmpty>
                  {
                    suggestions.map(suggestion => {
                      return (
                        <CommandItem 
                          key={ suggestion.placeId }
                          className="p-5 items-start"
                          onSelect={ () => handleSelectSuggestion(suggestion) }
                        >
                          <MapPin />
                          <div>
                            <p className="font-bold ">{ suggestion.placeName }</p>
                            <p className="text-muted-foreground">{ suggestion.address_text }</p>
                          </div>
                        </CommandItem>
                      )
                    })
                  }
                </>
              ) : (
                // 保存済みの住所を表示
                <>
                  <h3 className="mb-2 font-black text-lg">保存済みの住所</h3>

                  <CommandItem className="p-5">Calendar</CommandItem>
                  <CommandItem className="p-5">Search Emoji</CommandItem>
                  <CommandItem className="p-5">Calculator</CommandItem>
                </>
              )
            }
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}