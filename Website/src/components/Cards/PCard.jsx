import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import LottieAnimationSec from "../Lotte/LotteAnimationSec";
import { productAPI } from "@/services/api/apiService";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { AddShoppingCart } from "@mui/icons-material";
import { ToastContainer } from "react-toastify";
const PCard = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await productAPI.getAllProducts();
      setProducts(res.data);
      console.log(res.data);
    } catch (error) {
      console.log("Error while fetching the product", error.message);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="mt-8 px-4">
      <h1 className="text-3xl font-semibold text-center mb-8">Product</h1>
      <div className="container mx-auto">
        {Array.isArray(products) && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-8 mt-12 sm:mx-24">
            {products.map((cardData) => (
              <Link to={`/products/${cardData.id}`} key={cardData.id}>
              <div
                key={cardData.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg duration-500 hover:shadow-slate-300 border-2 border-slate-200 shadow-slate-400 ring-opacity-40"
              >
                <div className="relative group">
                  <div className="relative w-full h-48 sm:h-52 p-2 border border-slate-300 rounded-lg overflow-hidden bg-gray-50">
                    <img
                      className="object-cover w-full h-full rounded-lg transition-transform duration-300 hover:scale-105"
                      src={cardData.images[0]}
                      alt={cardData.name || "Product Image"}
                    />
                  </div>
                  {/* <div className="absolute top-0 right-0 px-1 py-1 m-2 rounded-md ">
                    <FavoriteBorderIcon />
                  </div>
                  <div className="absolute top-8 right-0 px-1 py-1 m-2 rounded-md ">
                    <VisibilityIcon />
                  </div> */}
                  {/* <div className="absolute left-0 top-3 px-2 py-1 rounded-md bg-red-500 text-white">
                    {Math.floor(cardData.discountPercentage)}% off
                  </div> */}
                  <button
                    onClick={() => handleAddToCart(cardData)}
                    className="absolute flex h-10 sm:h-10  rounded-full hover:text-white hover:bg-black items-center  right-0 p-3 py-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000   top-20 sm:top-[10.75rem] border border-black font-bold  "
                  >
                    <AddShoppingCart color="black" size={24} />
                  </button>
                </div>
                <div className="p-3">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
                      {cardData.name}
                    </h3>
                    <div className="flex justify-start items-center gap-4">
                    <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                      {cardData.category}
                    </span>
                     <span
                      className={`font-medium text-xs mt-1 p-1 rounded-lg ${
                        cardData.quantity > 0
                          ? "bg-green-100 text-green-500"
                          : "text-red-400"
                      }`}
                    >
                      {cardData.status ? "In Stock" : "Out of Stock"}
                    </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-3 leading-relaxed">
                    {cardData.description}
                  </p>

                  <div className="flex flex-col items-start justify-start">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, index) => (
                        <span
                          key={index}
                          className={`text-2xl ${
                            index < Math.floor(cardData.rating)
                              ? "text-yellow-400"
                              : "text-gray-400"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <p className="text-slate-500 pl-1">{cardData.rating}</p>
                    </div>
                  </div>
                  <div className="flex flex-row gap-5 items-start justify-start">
                    <span className="font-medium text-xl text-black-500">
                      Rs.{cardData.price}
                    </span>
                   
                  </div>

                  <ToastContainer />
                </div>
              </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No products available.
          </div>
        )}
      </div>
    </div>
  );
};

export default PCard;
