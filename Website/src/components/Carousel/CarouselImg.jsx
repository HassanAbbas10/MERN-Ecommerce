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
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";

const CarouselImg = () => {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);

  const carouselData = [
    { 
      id: 1, 
      url: summer, 
      title: "Summer Collection", 
      subtitle: "Discover fresh styles for the season",
      cta: "Shop Now"
    },
    { 
      id: 2, 
      url: summer2, 
      title: "Summer Specials", 
      subtitle: "Limited time offers on trending items",
      cta: "Explore Deals"
    },
    { 
      id: 3, 
      url: autumn, 
      title: "Autumn Collection", 
      subtitle: "Cozy essentials for cooler days",
      cta: "View Collection"
    },
    { 
      id: 4, 
      url: collage, 
      title: "Featured Collection", 
      subtitle: "Handpicked favorites just for you",
      cta: "Shop Featured"
    },
  ];

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative w-full">
      <Carousel
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: false,
          }),
        ]}
        setApi={setApi}
        className="w-full"
        opts={{
          loop: true,
          align: "center",
        }}
      >
        <CarouselContent className="w-full">
          {carouselData.length > 0 ? (
            carouselData.map((data) => (
              <CarouselItem key={data.id}>
                <div className="relative">
                  <Card className="border-0 overflow-hidden bg-gray-50 shadow-none rounded-none">
                    <CardContent className="p-0">
                      <div className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
                        <img
                          src={data.url}
                          alt={data.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                        
                        {/* Content */}
                        <div className="absolute inset-0 flex items-center">
                          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                            <div className="max-w-2xl">
                              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                                {data.title}
                              </h1>
                              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg">
                                {data.subtitle}
                              </p>
                              <div className="flex flex-col sm:flex-row gap-4">
                                <Button 
                                  size="lg" 
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold group"
                                >
                                  <ShoppingBag className="w-5 h-5 mr-2" />
                                  {data.cta}
                                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="lg" 
                                  className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg font-semibold bg-white/10 backdrop-blur-sm"
                                >
                                  Learn More
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))
          ) : (
            <div className="flex flex-1 items-center justify-center min-h-[500px]">
              <LottieAnimationThird />
            </div>
          )}
        </CarouselContent>

        {/* Navigation Arrows */}
        <div className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2">
          <CarouselPrevious className="h-12 w-12 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-gray-900 shadow-lg transition-all duration-300" />
        </div>
        <div className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2">
          <CarouselNext className="h-12 w-12 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-gray-900 shadow-lg transition-all duration-300" />
        </div>

        {/* Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {carouselData.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`transition-all duration-300 ${
                current === index
                  ? "w-10 h-3 bg-white rounded-full"
                  : "w-3 h-3 bg-white/50 hover:bg-white/75 rounded-full"
              }`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default CarouselImg;
