

// components/DeloveryAnimation.tsx
// 注文完了ページで使用

"use client";

import Lottie from "lottie-react";
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import deliveryData from "@/animationData/delivery.json";

export default function DeliveryAnimation(){

  return (
    <Lottie
      // className=""
      animationData={deliveryData}
      loop={true}
      autoplay={true}
    />
  )

  // return (
  //   <DotLottieReact
  //     src="https://lottie.host/5f4a4e3c-712a-497f-bde6-1c371d8a79a0/lxyN5X2Y9F.lottie"
  //     loop
  //     autoplay
  //   />
  // )
}






