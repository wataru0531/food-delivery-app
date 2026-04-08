

// MenuCard.tsx
// → 店舗詳細ページで使うカード

"use client"

import Image from "next/image";
import { MenuType } from "@/types";

type MenuCardProps = {
  menu: MenuType;
  openModal?: (menu: MenuType) => void;
}

export default function MenuCard({ menu, openModal }: MenuCardProps){
  // console.log(menu);
  // {id: 56, name: '醤油ラーメン', price: 800, photoUrl: 'https://ndpohcdojjruiosbmyxz.supabase.co/storage/v1/object/public/menus/ramen/shoyu-ramen.webp'}
  
  return(
    <div 
      className="cursor-pointer"
      onClick={ () => openModal?.(menu) }
    >
      <div className="relative aspect-square rounded-lg overflow-hidden">
        <Image
          src={ menu.photoUrl }
          alt={"メニュー画像"}
          className="object-cover w-full"
          fill
          sizes="(max-width: 1280px) 18.75vw, 240px"
        />
      </div>
      <div className="mt-2">
        <p className="font-bold truncate">{ menu.name }</p>
        <p className="text-muted-foreground">
          <span className="text-sm">¥{ menu.price }</span>
        </p>
      </div>
    </div>
  )
}



