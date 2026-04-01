
"use client";

import { CategoryMenusType } from '@/types';
import CategorySidebar from '../CategorySidebar';
import Section from '../Section';

type MenuContentProps = {
  categoryMenus: CategoryMenusType[];
}


const MenuContent = ({ categoryMenus }: MenuContentProps) => {
  // console.log(categoryMenus); // (4) [0: {id: 'featured', categoryName: '注目商品', items: Array(8)}, {…}, {…}, {…}]

  return (
    <div className="flex">
      {/* サイドバー */}
      <CategorySidebar categoryMenus={ categoryMenus } />

      {/* メニュー */}
      <div className="w-3/4 gap-4 bg-yellow-500">
        {
          categoryMenus.map(category => (
            <Section key={ category.id } title={ category.categoryName }>
              {/* 
                注目の商品 → スクロールできるコンテンツとして表示。idがfeatured
                その他はリストで表示
              */}
              {
                category.id === "featured" ? (
                  <div>スクロールコンテンツ</div>
                ) : (
                  <div>リストメニュー</div>
                )
              }
            </Section>
          ))
        }
      </div>
    </div>
  )
}

export default MenuContent