
// ✅ 住所に関するモーダル

"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useDebouncedCallback } from "use-debounce";


export default function AddressModal(){
  const [ inputText, setInputText ] = useState("");
  const [ sessionToken, setSessionToken ] = useState(uuidv4());
  // console.log(sessionToken);
  const [ suggestions, setSuggestions ] = useState([]);
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

      const data = await response.json();
      // console.log(data);

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
      // setOpen(false);
      setSuggestions([]); // 👉 検索結果のステートを空に
      // console.log(suggestions);

      return; // 文字を消し終えるとここで関数を終わらす
    }
    setIsLoading(true); // ローディングをtrueに
    // setOpen(true);

    fetchSuggestions(inputText);
  }, [ inputText ]);

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
                  <CommandEmpty>No results found.</CommandEmpty>
                  <div>サジェスチョン表示</div>
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



