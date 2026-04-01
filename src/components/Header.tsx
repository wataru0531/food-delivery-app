
// Header.tsx


import Link from "next/link";

import MenuSheet from "./MenuSheet";
import PlaceSearchBar from "./PlaceSearchBar";
import AddressModal from "./AddressModal";
import { fetchLocation } from "@/lib/restaurants/api";


export default async function Header(){
  const { lat, lng } = await fetchLocation();

  return(
    <header className="w-full h-16 bg-background fixed top-0 left-0 z-50">
      <div className="mx-auto px-4 max-w-[1280px] space-x-4 h-full flex items-center">
        <MenuSheet />

        <div className="font-bold">
          <Link href={"/"}>Delivery APP</Link>
        </div>

        <AddressModal />

        {/* 検索バー */}
        <div className="flex-1">
          <PlaceSearchBar lat={lat} lng={lng}  />
        </div>

        <div>カート</div>
      </div>
    </header>
  )
}