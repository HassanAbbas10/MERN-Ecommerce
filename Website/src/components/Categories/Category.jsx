import { categories } from "@/utils/categories";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import IonIcon from '@reacticons/ionicons';

const Category = () => {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [isStart, setIsStart] = useState(true);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
      setIsEnd(api.canScrollNext());
      setIsStart(api.canScrollPrev());
    });
  }, [api]);

  return (
    <div className="py-16 px-4 sm:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 px-4">
          <h2 className="text-3xl font-bold tracking-wider">
            Browse By Category
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => api?.scrollPrev()}
              className={`p-2 rounded-full border transition-all duration-300 hover:bg-red-500 hover:border-red-500 hover:text-white
                ${isStart ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-400'}`}
            >
              <IonIcon name="arrow-back-outline" className="text-2xl" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className={`p-2 rounded-full border transition-all duration-300 hover:bg-red-500 hover:border-red-500 hover:text-white
                ${isEnd ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-400'}`}
            >
              <IonIcon name="arrow-forward-outline" className="text-2xl" />
            </button>
          </div>
        </div>

        <Carousel
  setApi={setApi}
  className="w-full"
  opts={{
    align: "start",
    loop: false,
    skipSnaps: false,
    slidesToScroll: 1,
  }}
>
  <CarouselContent className="-ml-4">
    {categories.map((category) => (
      <CarouselItem
        key={category.id}
        className="pl-4 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 xl:basis-1/6"
      >
        <Card className="group h-full cursor-pointer overflow-hidden">
          <div className="relative flex flex-col items-center justify-center sm:p-6 p-2 h-full border border-gray-200 rounded-lg transition-all duration-300 hover:border-red-500 hover:shadow-lg hover:scale-[1.02]">
            <div className="sm:w-16 sm:h-16 h-8 w-8 flex items-center justify-center rounded-full bg-gray-50 group-hover:bg-red-500 transition-colors duration-300">
              <IonIcon
                name={category.picture}
                className="sm:text-3xl text-xl text-gray-700 group-hover:text-white transition-colors duration-300"
              />
            </div>
            <h3 className="mt-4 text-sm sm:text-lg font-medium text-gray-900 group-hover:text-red-500 transition-colors duration-300">
              {category.name}
            </h3>
            <div className="absolute inset-0 border-2 border-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Card>
      </CarouselItem>
    ))}
  </CarouselContent>
</Carousel>


   
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(categories.length / 6) }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index * 6)}
              className={`w-2 h-2 rounded-full transition-all duration-300 
                ${current === index * 6 ? 'w-8 bg-red-500' : 'bg-gray-300 hover:bg-red-300'}`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;