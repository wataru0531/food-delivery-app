
// RestaurantCard.tsx
// → スライダーに置くカード1枚

// ✅ TODO Imageコンポーネントをコンポーネント化

import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { Heart } from 'lucide-react';

// Imageコンポーネント
// width、heightモード → アスペクト比を計算させている。
//                 実際にこのサイズで表示されるとは限らない
// fillモード → position: absolute: がかかる
//             親にrelative、高さを必ず指定
//             object-fit がほぼ必須
//             width、heightは指定できない

const RestaurantCard: React.FC = () => {
  return (
      <div className="relative">
        <Link href="/abc" className="absolute w-full h-full z-10"></Link>
        {/* 
          aspect-video ... 16 : 9 
        */}
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Image 
            src={"/no-image.jpeg"} 
            // width="300" 
            // height="400" 
            className="object-cover"
            fill
            alt="wataru"
            loading="eager"
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="font-bold">name</p>
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