
// CarouselContainer.tsx

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type CarouselContainerProps = {
  children: React.ReactNode[]
  slideToShow: number; // スライドの枚数
}

export default function CarouselContainer({ 
  children, // Restaurantの配列
  slideToShow, // 幅をカード
}: CarouselContainerProps){
  // console.log(children); // RestaurantCardの配列 (5) [{$$typeof: Symbol(react.transitional.element),...}, (...), (...), (...), (...)]

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent>
        {children.map((child, index) => (
          <CarouselItem 
            key={index} 
            style={{ flexBasis: `${ 100 / slideToShow }%` }}
          >
            <div className="p-1">
              { child }
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
