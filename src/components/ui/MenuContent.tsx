
"use client";

import { CategoryMenusType } from "@/types";
import CategorySidebar from "../CategorySidebar";
import Section from "../Section";
import CarouselContainer from "../CarouselContainer";
import MenuCard from "../MenuCard";
import FlatMenuCard from "../FlatMenuCard";
import { useState } from "react";
import { InView } from "react-intersection-observer";
import MenuModal from "../MenuModal";
import { useModal } from "@/app/context/modalContext";
import { useCartVisibility } from "@/app/context/cartContext";
import { useCart } from "@/fooks/cart/useCart";

type MenuContentProps = {
  categoryMenus: CategoryMenusType[];
  restaurantId: string;
};


const MenuContent = ({ categoryMenus, restaurantId }: MenuContentProps) => {
  // console.log(categoryMenus);
  // (4) [0: {id: 'featured', categoryName: '注目商品', items: Array(8)}, {id: 56, name: '醤油ラーメン', price: 800, photoUrl: 'https://ndpohcdojjruiosbmyxz.supabase.co/storage/v1/object/public/menus/ramen/shoyu-ramen.webp'}, {…}, {…}]

  const { isOpen, openModal, closeModal, selectedItem } = useModal();
  const { openCart } = useCartVisibility(); // カートシートの開閉状態を管理

  // ✅ その店舗のカートのデータを取得
  // targetCart → 現在のページのカートのデータ
  const { targetCart } = useCart(restaurantId);
  // console.log(targetCart); // {id: 10, restaurant_id: 'ChIJZZPMQQDfAGARxEZtPATdWew', cart_items: Array(4), restaurantName: 'RAMEN JUNKEYZ', photoUrl: '/no-image.jpeg'}

  // どのカテゴリのidを選択しているか
  const [activeCategoryId, setActiveCategoryId] = useState(categoryMenus[0].id);

  // ✅ カテゴリークリック時に各セクションにスクロール
  const onSelectCategory = (categoryId: string) => {
    // console.log(categoryId);

    // 各Sectionの要素を取得
    const element = document.getElementById(`${categoryId}-menu`);
    // console.log(element); // featured-menu。ラーメン-menu

    if (element) {
      // scrollIntoView ... その要素が見える位置までスクロールする。ブラウザ標準のメソッド
      element.scrollIntoView({
        behavior: "smooth",
        block: "start", // center, end
      });
    }

    setActiveCategoryId(categoryId);
  };

  const onChangeCallback = (
    inView: boolean,
    entry: IntersectionObserverEntry,
  ) => {
    // console.log(entry.target.id)
    // console.log(inView); // 入ればtrue、出ればfalse
    if (!inView) return;

    if (entry.intersectionRatio < 0.7) return;

    const element = entry.target as HTMLElement;
    const categoryId = element.id.replace("-menu", "");
    // console.log(categoryId); // ラーメン サイドメニュー ドリンク

    setActiveCategoryId(categoryId);
  };

  return (
    <div className="mt-4 flex">
      {/* サイドバー */}
      <CategorySidebar
        categoryMenus={categoryMenus}
        onSelectCategory={onSelectCategory}
        activeCategoryId={activeCategoryId}
        // setActiveCategoryId={ setActiveCategoryId }
      />

      {/* メニュー */}
      <div className="w-3/4 gap-4 ">
        {categoryMenus.map((category) => (
          // ✅ react-intersection-observerで監視
          <InView
            key={category.id}
            as="div" // divタグとして扱う
            className="scroll-mt-16"
            id={`${category.id}-menu`}
            onChange={ onChangeCallback }
            threshold={0.7} // 要素がどれくらい“画面内に入ったか”の割合。70%
          >
            {/* scroll-mt-16 → スクロール時だけ影響する */}
            <div>
              <Section title={ category.categoryName }>
                {/* 
                    注目の商品 → スクロールできるコンテンツとして表示。idがfeatured
                    その他はリストで表示
                  */}
                { category.id === "featured" ? (
                  // ✅ スライダー
                  <CarouselContainer slideToShow={4}>
                    {category.items.map((menu) => (
                      <MenuCard
                        key={menu.id}
                        menu={menu}
                        openModal={openModal}
                      />
                    ))}
                  </CarouselContainer>
                ) : (
                  // ✅ リスト
                  <div className="grid grid-cols-2 gap-4">
                    {category.items.map((menu) => (
                      <FlatMenuCard
                        key={menu.id}
                        menu={menu}
                        openModal={openModal}
                      />
                    ))}
                  </div>
                )}
              </Section>
            </div>
          </InView>
        ))}
      </div>

      {/* モーダル */}
      <MenuModal 
        isOpen={ isOpen } 
        closeModal={ closeModal }
        selectedItem={ selectedItem }
        restaurantId={ restaurantId }
        openCart={ openCart }
        targetCart={ targetCart }
      />
    </div>
  );
};

export default MenuContent;
