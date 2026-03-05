
"use client"
// components/ui/Section.tsx

import { ReactNode, useState } from "react"
// import { TextToggleButton } from "./TextToggleButton";
import { Button } from "./ui/button";


type SectionProps = {
  children: ReactNode;
  title?: string;
  expandedContent?: ReactNode;
}


export default function Section({ children, title, expandedContent }: SectionProps){
  const [ isExpanded, setIsExpanded ] = useState(false);
  const handleChange = () => setIsExpanded(prev => !prev);

  return (
    <section>
      <div className="py-3 flex items-center justify-between">
        <h2 className="py-5 font-bold text-2xl">{ title }</h2>
        {/* <TextToggleButton /> */}

        <Button onClick={ handleChange } className="xl:not-even:hover:cursor-pointer">
          { isExpanded ? "表示を戻す" : "すべて表示" }
        </Button>
      </div>

      {/* リスト or CarouselContainer(スクロールコンテント) */}
      { isExpanded ? expandedContent : children } 
    </section>
  )
}

