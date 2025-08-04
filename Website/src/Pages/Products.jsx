import { lazy, Suspense } from "react";
import { ComponentLoadingSpinner } from "@/components/Loading/LoadingSpinner";

// Lazy load product components
const PCard = lazy(() => import("@/components/Cards/PCard"));
// const Search = lazy(() => import("@/components/Search"));

const Products = () => {
  return (
    <div>
      <div className="max-width-full h-24 bg-indigo-100 flex justify-center items-center">
        <h1 className="text-3xl text-black px-4">Product section 🛒</h1>
      </div>
      
      <Suspense fallback={<ComponentLoadingSpinner message="Loading products..." />}>
        <PCard />
      </Suspense>
    </div>
  );
};

export default Products;
