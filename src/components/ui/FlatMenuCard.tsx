
// 店舗詳細ページのリスト

import Image from "next/image";

import { MenuType } from "@/types"
import { Card } from "./card";


type FlatMenuCardType = {
  menu: MenuType;
}

export default function FlatMenuCard({ menu }: FlatMenuCardType){
  // console.log(menu); // {id: 70, name: 'メンマ', price: 150, photoUrl: 'https://ndpohcdojjruiosbmyxz.supabase.co/storage/v1/object/public/menus/ramen/bamboo-shoot.webp'}
  
  return(
    <Card className="p-0 overflow-hidden">
      <div className="flex flex-1">
        <div className="w-3/5 p-4">
          <p className="font-bold">名前: { menu.name }</p>
          <p className="text-muted-foreground">¥{ menu.price }</p>
        </div>
        <div className="w-2/5 relative aspect-square">
          <Image
            // src={ menu.photoUrl }
            src={"/no-image.jpeg"}
            alt={ menu.name }
            fill
            sizes="176px"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </Card>
  )
}


