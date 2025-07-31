import useFetch from "@/Hooks/useFetch/useFetch";

import LottieAnimationThird from "../Lotte/LotteanimationThird";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { addToCart } from "@/Redux/cartSlice.js";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { AddShoppingCart } from "@mui/icons-material";

const HomeDecorC = ({ Category, Title }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    if (product) {
      dispatch(addToCart(product));
      toast("Product added to cart", {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  const apiUrl = `https://dummyjson.com/products/category/${Category}?q&limit=5`;
  const { data, error, isLoading } = useFetch([`${Category}`], apiUrl);

  if (error) return <div>The error is {error}</div>;

  if (isLoading) {
    return (
      <div className="text-2xl italic flex flex-1 items-center justify-center">
        <LottieAnimationThird />
      </div>
    );
  }

  return (
    <div className="mt-8 px-4">
      <h1 className="text-3xl font-semibold text-center mb-8">{Title}</h1>
      <div className="container mx-auto">
        {Array.isArray(data) && data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-12 mx-10 sm:mx-24">
            {data.map((cardData) => (
              <div
                key={cardData.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg  ring-opacity-40"
              >
                <div className="relative group">
                  <div className="w-56 sm:py-10 py-[1.5rem] flex justify-center items-center h-28 sm:h-52  overflow-hidden">
                    <img
                      className="object-contain w-full h-full "
                      src={cardData.images[0]}
                      alt="Product Image"
                    />
                  </div>
                  <div className="absolute top-0 right-0 px-2 py-1 m-2 rounded-md ">
                    <FavoriteBorderIcon />
                  </div>
                  <div className="absolute top-8 right-0 px-2 py-1 m-2 rounded-md ">
                    <VisibilityIcon />
                  </div>
                  <div className="absolute left-0 top-3 px-2 py-1 rounded-md bg-red-500 text-white">
                    {Math.floor(cardData.discountPercentage)}% off
                  </div>
                  <button
                    onClick={() => handleAddToCart(cardData)}
                    className="absolute flex h-10 sm:h-10  rounded-full hover:text-white hover:bg-black items-center  right-0 p-3 py-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000   top-20 sm:top-[10.75rem] border border-black font-bold  "
                  >
                    <AddShoppingCart color="black" size={24} />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium mb-2">{cardData.title}</h3>

                  <div className="flex flex-col items-start justify-start">
                    <div className="flex flex-row gap-5 items-start justify-start">
                    <span className="font-bold text-lg text-red-500">
                      ${cardData.price}
                    </span>
                    <span className={`font-medium text-xs p-1 rounded-lg ${cardData.stock > 0 ? "bg-green-400 text-white" : 'text-red-400'}`}>
                      {cardData.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                    </div>
                    
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, index) => (
                        <span
                          key={index}
                          className={`text-lg ${
                            index < Math.floor(cardData.rating)
                              ? "text-black"
                              : "text-gray-400"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <p className="text-slate-500 pl-1">{cardData.rating}</p>
                    </div>
                  </div>
                  <ToastContainer />
                </div>
              </div>
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

export default HomeDecorC;
