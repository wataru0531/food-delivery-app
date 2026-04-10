
// カート
"use client"

import { useCart } from "@/fooks/cart/useCart"


export default function Cart(){

  const { carts, cartsError, isLoading, mutateCart } = useCart();
  // console.log(carts); 
  // { results: [{ id: 1, restaurant_id: "ChIJZZPMQQDfAGARxEZtPATdWew", restaurantName: "RAMEN JUNKEYZ", photoUrl: "/no-image.jpeg", cart_items: [{ ... }, { ... }] }] }

  return (
    <div>Cart</div>
  )
}