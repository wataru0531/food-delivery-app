
// ✅ リスト表示の際に使うリストコンポーネント

import { RestaurantType } from "@/types"
import RestaurantCard from "./RestaurantCard"

type RestaurantListProps = {
  restaurants: RestaurantType[]
}

export function RestaurantList({ restaurants }: RestaurantListProps){
  // console.log(restaurants); 
  // [{ id: 'ChIJAaqNQwYFAWARjnzJn1QLYDY', restaurantName: 'キッチンsora', primaryType: 'japanese_restaurant', photoUrl: '/no-image.jpeg'}, ...]

  return(
    <ul className="grid grid-cols-4 gap-4">
      {
        restaurants.map(restaurant => (
          <li key={ restaurant.id }>
            <RestaurantCard restaurant={ restaurant } />
          </li>
        ))
      }
    </ul>
  )
}