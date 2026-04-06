
// ✅ リスト表示の時に使う

import { MenuType } from "@/types"
import MenuCard from "./MenuCard"



type MenuListProps = {
  menus: MenuType[]
}

export default function MenuList({ menus }: MenuListProps){
  // console.log(menus); 
  // (22) [0: {id: 56, name: '醤油ラーメン', price: 800, photoUrl: 'https://ndpohcdojjruiosbmyxz.supabase.co/storage/v1/object/public/menus/ramen/shoyu-ramen.webp'}, {…}, ...]

  return(
    <div className="grid grid-cols-4 gap-4">
      {
        menus.map(menu => (
          <MenuCard key={ menu.id } menu={ menu } />
        ))
      }
    </div>
  )
}




