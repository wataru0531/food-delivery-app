
// RestaurantCard.tsx
// → スライダーに置くカード1枚

// ✅ TODO Imageコンポーネントをコンポーネント化

import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { Heart } from 'lucide-react';
import { RestaurantType } from '@/types';

// ✅ Imageコンポーネント
// width/height指定モード → 指定した width × height からアスペクト比を計算
//                        実際にこのサイズで表示されるとは限らない
//                         → あくまで、アスペクト比、初期レイアウト確保のために使われる
//                        表示前から最初から高さが確保されるためレイアウトシフト(CLS)を防ぎやすい

// fill指定モード → 画像が親要素に合わせて広がる指定
//                position: absolute: が自動でかかる
//                親要素にrelative、高さを必ず指定 → ここでは、aspect-ratio
//                object-fit がほぼ必須
//                width、heightは指定できない

type RestaurantCardProps = {
  restaurant: RestaurantType
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const { restaurantName, photoUrl } = restaurant;
  // console.log(restaurant);
  // {id: 'ChIJ58ZWi1IEAWARVLLkq8lYNj4', restaurantName: 'RA－MEN 赤影', primaryType: 'ramen_restaurant', photoUrl: 'no-image.jpeg'}

  return (
      <div className="relative">
        <Link href="/abc" className="absolute w-full h-full z-10"></Link>
        {/* 
          aspect-video ... 16 : 9 
        */}
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Image 
            src={ photoUrl ?? "/no-image.jpeg" } // undefinedの可能性があるならエラーが出るのでフォールバックを用意 
            // width="300" 
            // height="400" 
            className="object-cover"
            fill
            alt={ restaurantName ?? "ラーメン店" }
            // loading="eager" // 即読み込む
            // priority // 👉 LCP(最重要画像)だから最優先で読み込めという命令。eager扱い
                     //  → Largest Contentful Paint ... サイトで物理的に大きい要素になっている
                     //    画像がLCPになっているが、lazy読み込み
                     //    表示が遅れる可能性があるので、Next.jsがpriorityをつけたほうがいいと言ってる。
                     //    しかし、後から大きなメインビューの要素を追加するので警告を無視する
            // ✅ sizes 表示領域に対して最適な画像を選択させる
            // → 指定しない場合は、幅100pxに対して1000px以上の幅の画像を読み込んでしまう可能性がある
            //   指定は25%ではなくて、25vwで読み込む
            sizes="(max-width: 1280px) 25vw, 280px" // 1280未満は25%表示、それ以上は280pxで固定
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="font-bold">{ restaurantName ?? "ラーメン店" }</p>
          {/* <div>rating</div> */}
          <div className="z-20">
            <Heart 
              size={15}
              color="gray"
              strokeWidth="2"
              className="hover:fill-red-500 hover:stroke-0" 
            />
          </div>
        </div>
      </div>
  )
}

export default RestaurantCard