import { lazy, Suspense } from "react";
import { ComponentLoadingSpinner } from "@/components/Loading/LoadingSpinner";

// Lazy load home components for better performance
const CarouselImg = lazy(() => import("@/components/Carousel/CarouselImg"));
const HomeDecorC = lazy(() => import("@/components/Categ/HomeDecorC"));
const Category = lazy(() => import("@/components/Categories/Category"));
const HighLights = lazy(() => import("@/components/FeatureHighlights/HighLights"));
const Newsletter = lazy(() => import("@/components/NewsLetter/NewsLetter"));

const Home = () => {
  return (
    <div>
      <Suspense fallback={<ComponentLoadingSpinner message="Loading carousel..." />}>
        <CarouselImg />
      </Suspense>
      
      <div className="max-width-full h-28 bg-indigo-100 flex justify-center items-center mt-5">
        <h1 className="text-3xl text-black px-4">Category section </h1>
      </div>
      
      <Suspense fallback={<ComponentLoadingSpinner message="Loading categories..." />}>
        <Category />
      </Suspense>
      
      <Suspense fallback={<ComponentLoadingSpinner message="Loading products..." />}>
        <HomeDecorC Title={"Perfumes"} Category={"fragrances"} />
        <HomeDecorC Title={"Laptops"} Category={"laptops"} />
        <HomeDecorC Title={"Home Decoration"} Category={"home-decoration"} />
        <HomeDecorC Title={"Groceries"} Category={"groceries"} />
      </Suspense>
      
      <Suspense fallback={<ComponentLoadingSpinner message="Loading highlights..." />}>
        <HighLights />
      </Suspense>
      
      <Suspense fallback={<ComponentLoadingSpinner message="Loading newsletter..." />}>
        <Newsletter />
      </Suspense>
    </div>
  );
};

export default Home;
