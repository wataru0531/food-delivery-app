
// ✅ 住所に関するモーダル

"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import useSWR, { mutate } from 'swr';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useDebouncedCallback } from "use-debounce";
import { AddressSuggestionType, AddressType } from "@/types";
import { AlertCircle, LoaderCircle, MapPin, Trash2 } from "lucide-react";
import { deleteAddressAction, selectAddressAction, selectSuggestionAction } from "@/app/(private)/actions/addressActions";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";


type AddressResponseType = {
  addressList: AddressType[];
  selectedAddress: AddressType;
}

export default function AddressModal(){
  const router = useRouter();
  const [ inputText, setInputText ] = useState("");
  const [ sessionToken, setSessionToken ] = useState(uuidv4());
  // console.log(sessionToken);

  const [ suggestions, setSuggestions ] = useState<AddressSuggestionType[]>([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState<string | null>(null);
  const [ open, setOpen ] = useState(false); // モーダルの開閉状態

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
  // useEffect → useSWRよりも、特定のデータを取得するのであればuseEffectの方が向いている
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


  // ✅ ログイン中のユーザーに紐づく住所、現在選択中の住所を取得
  // ⭐️ useSWR  
  //    → ・データを自動でキャッシュ
  // 　　　・「古いデータ(キャッシュ)をまず表示 → バックグラウンドで最新データ取得」
  //         ... 比較が行われて新しいのなら更新
  //      ・たった2行でデータ、エラー、ローディングを設定できる
  // fetcher ... JSONデータを使用する通常のRESTful APIの場合、ネイティブのfetchをラップしたfetcher関数を作成する必要がある
  const fetcher = async (url: string) => {
    const response = await fetch(url);

    if(!response.ok) {
      const errorData = await response.json(); // エラーをここで受け取る。
      throw new Error(errorData.error); // 👉 ここで、Route Handlerのエラーを、useSWRのerrorに渡すことができる
    }

    const data = await response.json();
    return data;
  }

  const { 
    data,  // Route Handlerでのエラーは、このdataに入る(デフォルト)。正常なデータも入る
    error, // fetcherのエラーが入る(デフォルト)
    isLoading: loading, 
    mutate 
  } = useSWR<AddressResponseType>(`/api/address`, fetcher);
  // console.log("useSWR!!", data); // [{id: 12, name: 'RAMEN JUNKEYZ', address_text: '大阪府東大阪市七軒家１２−２７', latitude: 34.6882322, longitude: 135.5892084} ,{}]

  if(error) {
    console.error(error);
    return <div className="text-red-500">{ error.message }</div>
  }

  if(loading) {
    return (
      <>
        Loading <LoaderCircle className="animate-spin" />
      </>
    )
  }
  
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
      setInputText(""); // サジェスチョンを空にする

      mutate(); // ✅ useSWRでデータを再検証、取得して表示
      router.refresh(); // 👉 サーバーコンポーネントを再実行、最新データで書き直す
                        //    今表示しているルートツリーのみ再実行ということ
    } catch(e) {
      console.error(e);
      window.alert("予期せぬエラーが発生しました。");
    }
  }

  // ✅ 現在選択中の住所を更新
  const handleSelectAddress = async (address: AddressType) => {
    // console.log("address!!", address);
    try {
      await selectAddressAction(address.id);
      mutate(); // useSWRでデータを再検証、取得。クライアント側のデータのみ更新
      setOpen(false);
      router.refresh();
    } catch(error) {
      console.error(error);
      alert("予期せぬエラーが発生しました。");
    }
  }

  // ✅ クリックした、ログイン中のユーザーに紐づく住所を1つ削除
  const handleDeleteAddress = async (addressId: number) => {
    // console.log("addressId!!", addressId);
    const ok = window.confirm(`この住所を削除しますか？: 住所アドレスID: ${addressId}`)
    if(!ok) return;

    try {
      const selectedAddressId = data?.selectedAddress?.id; // 現在の選択中の住所のidを取得
      await deleteAddressAction(addressId);
      mutate();

      // 現在選択中の住所
      if(selectedAddressId === addressId){ 
        router.refresh(); 
      }
    } catch(error) {
      console.error(error);
      alert("予期せぬエラーが発生しました。");
    }
  }

  return(
    <Dialog 
      open={ open } // モーダルの開閉状態。
      onOpenChange={(prevState) => setOpen(prevState)} // DialogTrigger、黒背景をクリックしすると発火
    >
      <DialogTrigger>
        <div className="flex flex-col items-start">
          <p className="font-bold">選択中の住所</p>
          <p>({ data?.selectedAddress?.name ? data?.selectedAddress?.name : "未選択(=京都市)" })</p>
        </div>
      </DialogTrigger>

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
                // 保存済みの住所を表示。ログイン中ユーザーに紐づいた住所のデータ
                <>
                  <h3 className="mb-2 font-black text-lg">保存済みの住所</h3>
                  {
                    data?.addressList.map((address) => (
                      <CommandItem 
                        key={address.id} 
                        className={cn("p-5 flex items-center justify-between", address.id === data?.selectedAddress?.id && "bg-muted")}
                        onSelect={() => handleSelectAddress(address)} 
                      >
                        <div>
                          <p className="font-bold">{ address.name }</p>
                          <p className="">{ address.address_text }</p>
                        </div>
                        <Button 
                          size={"icon"} variant={"ghost"}
                          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                            e.stopPropagation(); // 👉 バブリングさせない
                            handleDeleteAddress(address.id) 
                          }}
                        >
                          <Trash2 />
                        </Button>
                      </CommandItem>
                    ))
                  }
                </>
              )
            }
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}