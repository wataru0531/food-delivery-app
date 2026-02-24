
// components/ui/Section.tsx

import { ReactNode } from "react"
import { Button } from "./ui/button";
import { TextToggleButton } from "./TextToggleButton";


type SectionProps = {
  children: ReactNode;
  title?: string,
}

export default function Section({ children, title }: SectionProps){
  
  return (
    <section>
      <div className="py-3 flex items-center justify-between">
        <h2 className="py-5 font-bold text-2xl">{ title }</h2>
        <TextToggleButton />
      </div>
      { children }
    </section>
  )
}

