
// TextToggleButton.tsx

"use client"

import { useState } from "react";
import { Button } from "./ui/button";


export function TextToggleButton(){
  const [ isExpanded, setIsExpanded ] = useState(false);

  const handleChange = () => {
    setIsExpanded(prev => !prev);
  }

  return(
    <Button onClick={ handleChange } className="xl:not-even:hover:cursor-pointer">
      { isExpanded ? "表示を戻す" : "すべて表示" }
    </Button>
  )
}





