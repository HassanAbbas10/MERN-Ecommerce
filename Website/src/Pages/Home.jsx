import CarouselImg from "@/components/Carousel/CarouselImg";

import HomeDecorC from "@/components/Categ/HomeDecorC";
import Category from "@/components/Categories/Category";
import HighLights  from "@/components/FeatureHighlights/HighLights";
import Newsletter from "@/components/NewsLetter/NewsLetter";
const Home = () => {
  return (
    <div>
      <CarouselImg />
      <div className="max-width-full h-28 bg-indigo-100 flex justify-center items-center mt-5">
        <h1 className="text-3xl text-black px-4">Category section </h1>
      </div>
      <Category/>
      <HomeDecorC Title={"Perfumes"} Category={"fragrances"}/>
      <HomeDecorC Title={"Laptops"} Category={"laptops"}/>
      <HomeDecorC Title={"Home Decoration"} Category={"home-decoration"}/>
      <HomeDecorC Title={"Groceries"} Category={"groceries"}/>
      <HighLights/>
      <Newsletter/>
    </div>
  );
};

export default Home;
