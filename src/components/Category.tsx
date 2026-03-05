
// ✅ カテゴリー

import Image from "next/image";

import { CategoryType } from "./Categories";

type CategoryPropsType = {
  category: CategoryType;
}

export function Category({ category: { categoryName, type, imageUrl } }: CategoryPropsType){
  // console.log(category);

  return(
    <div>
      <div className="relative aspect-square rounded-lg overflow-hidden bg-green-100">
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

