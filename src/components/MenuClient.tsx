

// ✅ MenuClient

"use client"

import Link from "next/link";
import CarouselContainer from "./CarouselContainer"
import MenuCard from "./MenuCard";
import { useModal } from "@/app/context/modalContext";
import { MenuType, RestaurantType } from "@/types";

type MenuClientPropsType = {
  menus:  MenuType[];
  restaurantId: string;
}


export default function MenuClient({ menus, restaurantId }: MenuClientPropsType){
  const { openModal } = useModal();

  return(
    <CarouselContainer slideToShow={6}>
      {
        menus.map((menu) => (
          <Link key={ menu.id } href={`/restaurant/${restaurantId}`}>
            <MenuCard menu={ menu } openModal={ openModal }/>
          </Link>
        ))
      }
    </CarouselContainer>
  )
}










