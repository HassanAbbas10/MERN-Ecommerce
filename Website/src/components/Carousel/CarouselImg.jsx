import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { summer, summer2, autumn, collage } from "@/assets/index";
import Autoplay from "embla-carousel-autoplay";
import LottieAnimationThird from "../Lotte/LotteanimationThird";

const CarouselImg = () => {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);

  const apiDataa = [
    { id: 1, url: summer, title: "Summer Collection" },
    { id: 2, url: summer2, title: "Summer Specials" },
    { id: 3, url: autumn, title: "Autumn Collection" },
    { id: 4, url: collage, title: "Featured Collection" },
  ];

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative w-full px-4 py-6">
      <Carousel
        plugins={[
          Autoplay({
            delay: 4000,
            stopOnInteraction: false,
          }),
        ]}
        setApi={setApi}
        className="w-full max-w-7xl mx-auto"
        opts={{
          loop: true,
          align: "center",
        }}
      >
        <CarouselContent className="w-full">
          {apiDataa.length > 0 ? (
            apiDataa.map((data) => (
              <CarouselItem key={data.id}>
                <div className="relative">
                  <Card className="border-0 overflow-hidden bg-gray-50 shadow-lg rounded-lg">
                    <CardContent className="p-0">
                      <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
                        <img
                          src={data.url}
                          alt={data.title}
                          className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-6 text-white">
                          <h2 className="text-2xl sm:text-3xl font-bold mb-2 shadow-md">
                            {data.title}
                          </h2>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))
          ) : (
            <div className="flex flex-1 items-center justify-center min-h-[300px]">
              <LottieAnimationThird />
            </div>
          )}
        </CarouselContent>

        <div className="absolute -left-4 top-1/2 -translate-y-1/2">
          <CarouselPrevious className="h-12 w-12 bg-white border-2 border-gray-300 rounded-full shadow-md hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="absolute -right-4 top-1/2 -translate-y-1/2">
          <CarouselNext className="h-12 w-12 bg-white border-2 border-gray-300 rounded-full shadow-md hover:scale-110 transition-transform duration-300" />
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {apiDataa.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                current === index
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default CarouselImg;
