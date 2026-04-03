

// 店舗詳細ページのサイドバー

import { cn } from "@/lib/utils";
import { CategoryMenusType } from "@/types"
// import { SetStateAction } from "react";

type CategorySidebarProps = {
  categoryMenus: CategoryMenusType[];
  onSelectCategory: (categoryId: string) => void;
  activeCategoryId: string;
  // setActiveCategoryId:  React.Dispatch<SetStateAction<string>>;
}


export default function CategorySidebar({ 
  categoryMenus, 
  onSelectCategory, 
  activeCategoryId 
}: CategorySidebarProps){
  // console.log(categoryMenus); // (4) [{id: 'featured', categoryName: '注目商品', items: Array(8)}, {…}, {…}, {…}]

  return(
    <aside className="w-1/4">
      {/* 
        stickyは親要素の範囲で固定される
      */}
      <div className="sticky top-16">
        <p className="p-3 font-bold">メニュー menu</p>
        <nav>
          <ul>
            {
              categoryMenus.map(menu => (
                <li 
                  key={menu.id} 
                  className={cn(
                    "w-full p-4 border-l-8 transition-color",
                    activeCategoryId === menu.id ? "bg-input font-medium border-primary" : "hover:bg-muted border-transparent"
                  )}
                >
                  <button 
                    onClick={ () => onSelectCategory(menu.id) } 
                    type="button"
                    className="w-full text-left"
                  >
                    { menu.categoryName }
                  </button>
                </li>
              ))
            }
          </ul>
        </nav>
      </div>
    </aside>
  )
}
