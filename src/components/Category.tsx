
// ✅ カテゴリー

"use client";

import Image from "next/image";

import { CategoryType } from "./Categories";
import { cn } from "@/lib/utils";

type CategoryPropsType = {
  category: CategoryType;
  onClick: (type:string) => void;
  select: boolean;
}

export function Category({ 
  category: { categoryName, type, imageUrl },
  onClick,
  select,
}: CategoryPropsType){

  return(
    <div onClick={ () => onClick(type) }>
      {/* <div className={`relative aspect-square rounded-full overflow-hidden ${select && "bg-green-200"}`}> */}
      <div className={cn(
        "relative aspect-square rounded-full overflow-hidden",
        select && "bg-green-200"
      )}>
        <Image
          src={ imageUrl }
          className="object-cover scale-75"
          fill
          alt={ categoryName }
          sizes="(max-width: 1280px) 10vw, 97px"
        />
      </div>
      <div className="mt-2 text-center">
        {/* 
          truncate ...  text-overflow: ellipsis; → はみ出した時に、... で終わる
                        white-space: nowrap;
                        overflow: hidden;
        */}
        <p className="text-sm truncate ">{ categoryName }</p>
      </div>
    </div>
  )
}

