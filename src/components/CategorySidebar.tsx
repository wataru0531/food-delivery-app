

// 店舗詳細ページのサイドバー

import { CategoryMenusType } from "@/types"


type CategorySodebarProps = {
  categoryMenus: CategoryMenusType[]
}

export default function CategorySidebar({ categoryMenus }: CategorySodebarProps){
  // console.log(categoryMenus); // (4) [{id: 'featured', categoryName: '注目商品', items: Array(8)}, {…}, {…}, {…}]

  return(
    <aside className="w-1/4 bg-green-500">
      <p className="p-3 font-bold">メニュー menu</p>
      <nav>
        <ul>
          {
            categoryMenus.map(menu => (
              <li key={menu.id} className="w-full p-4 tex-left">
                <button type="button">{ menu.categoryName }</button>
              </li>
            ))
          }
        </ul>
      </nav>
    </aside>
  )
}
