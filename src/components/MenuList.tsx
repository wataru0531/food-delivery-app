
// ✅ リスト表示の時に使う

"use client"

import Link from "next/link";

import { MenuType } from "@/types"
import MenuCard from "./MenuCard"
import { useModal } from "@/app/context/modalContext";

type MenuListProps = {
  menus: MenuType[];
  restaurantId: string;
}

export default function MenuList({ menus, restaurantId }: MenuListProps){
  // console.log(menus); 
  // (22) [0: {id: 56, name: '醤油ラーメン', price: 800, photoUrl: 'https://ndpohcdojjruiosbmyxz.supabase.co/storage/v1/object/public/menus/ramen/shoyu-ramen.webp'}, {…}, ...]

  const { openModal } = useModal();

  return(
    <div className="grid grid-cols-4 gap-4">
      {
        menus.map(menu => (
          <Link key={ menu.id } href={`/restaurant/${restaurantId}`}>
            <MenuCard key={ menu.id } menu={ menu } openModal={ openModal } />
          </Link>
        ))
      }
    </div>
  )
}


