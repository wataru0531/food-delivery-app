
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
  Settings,
  Smile,
  User,
} from "lucide-react";

export default function PlaceSearchBar(){
  const [ open, setOpen ] = useState(false);
  const [ inputText, setInputText ] = useState("");

  const fetchSuggestions = async () => {
    // try catch文でエラーを捕まえると、error.tsxではハンドリングされない。
    // また、error.tsxは、useEffectのエラーは基本的に捕まえない
    // → useEffectはレンダリング後に実行されるため
    //   ⭐️ 他のAPIはレンダリングプロセス中に実行されるので、error.tsxでハンドリングさせている
    //   onClickなども同じで、try catch文で処理する
    try {

    } catch(e) {

    }
  }

  // ✅ inputTextの内容が変更次第発火
  useEffect(() => {
    if(!inputText.trim()){ // 空白があれば切り取る
      setOpen(false);

      return; // 文字を消し終えるとここで関数を終わらす
    }
    setOpen(true);

    fetchSuggestions();
  }, [ inputText ]);

  const handleBlur = () => setOpen(false);
  const handleFocus = () => {
    // テキストがある場合のみサジェスチョンを開ける。
    if(inputText){
      setOpen(true);
    }
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
              <CommandItem>Calender</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
            </CommandList>
          </div>
        )
      }
      
    </Command>
  )
}









