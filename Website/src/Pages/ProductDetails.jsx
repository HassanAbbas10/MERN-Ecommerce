import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, remFromCart } from "@/Redux/cartSlice";
import { useCallback } from "react";
import { axiosInstance } from "@/services/api/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const cartP = useSelector((state) => state.cart.cart);
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const productImages = product ? [
    product.images[0],
    product.images[1],
    product.images[2],
    product.images[3],
    product.images[4],
  ] : [];

  const handleRemFromCart = () => {
    if (product) {
      dispatch(remFromCart(product));
      toast("Product removed from cart", {
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

  const handleAddToCart = () => {
    if (product) {
      // Add multiple items based on selected quantity
      for (let i = 0; i < quantity; i++) {
        dispatch(addToCart(product));
      }
      toast(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart`, {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // Reset quantity to 1 after adding
      setQuantity(1);
    }
  };

  const fetchProductById = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/products/${id}`);
      setProduct(res.data.data);
      console.log(res.data.data);
      console.log("Product fetching has been done successfully");
    } catch (error) {
      console.log("Error has occurred while Product Fetching", error);
    }
  }, [id]);

  useEffect(() => {
    fetchProductById();
  }, [fetchProductById]);

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const increaseQuantity = () => {
    if (product && quantity < product.quantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= product.quantity) {
      setQuantity(value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {product ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image Gallery Section */}
              <div className="p-8 bg-gray-50">
                <div className="space-y-6">
                  {/* Main Image */}
                  <div className="relative group">
                    <div className="aspect-square w-full overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-200">
                      <img
                        src={productImages[selectedImageIndex]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    
                    {/* Navigation Arrows */}
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                      {selectedImageIndex + 1} / {productImages.length}
                    </div>
                  </div>

                  {/* Thumbnail Images */}
                  <div className="grid grid-cols-5 gap-3">
                    {productImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        onMouseEnter={() => setSelectedImageIndex(index)}
                        className={`aspect-square overflow-hidden rounded-xl border-3 transition-all duration-300 transform hover:scale-105 ${
                          selectedImageIndex === index
                            ? "border-blue-500 ring-4 ring-blue-200 shadow-lg"
                            : "border-gray-200 hover:border-gray-400 hover:shadow-md"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} view ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Information Section */}
              <div className="p-8 lg:p-12">
                <div className="space-y-6">
                  {/* Product Header */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full ring-1 ring-blue-200">
                        {product.category}
                      </span>
                      {product.brand && (
                        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full ring-1 ring-gray-200">
                          {product.brand}
                        </span>
                      )}
                    </div>
                    
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                      {product.name}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, index) => (
                          <span
                            key={index}
                            className={`text-base ${
                              index < Math.floor(product.rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {product.rating} / 5
                      </span>
                     
                      
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-2xl font-bold text-green-600">
                        Rs. {product.price.toLocaleString()}
                      </span>
                      {product.discountPercentage && (
                        <>
                          <span className="text-base text-gray-500 line-through">
                            Rs. {Math.round(product.price * (1 + product.discountPercentage / 100)).toLocaleString()}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                            {product.discountPercentage}% OFF
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-green-700 font-medium text-sm">
                      💰 Best price guaranteed • 🚚 Free shipping on orders over Rs. 2000
                    </p>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-3">
                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm ${
                      product.quantity > 0
                        ? "bg-green-100 text-green-800 ring-1 ring-green-200"
                        : "bg-red-100 text-red-800 ring-1 ring-red-200"
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        product.quantity > 0 ? "bg-green-500" : "bg-red-500"
                      }`}></div>
                      {product.status ? "In Stock" : "Out of Stock"}
                    </div>
                    {product.quantity > 0 && (
                      <span className="text-sm text-gray-600 font-medium">
                        Only {product.quantity} left in stock
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div className="prose prose-gray max-w-none">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Description</h3>
                    <p className="text-gray-700 leading-relaxed text-base">
                      {product.description}
                    </p>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">Quantity:</label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={product?.quantity || 1}
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-16 px-3 py-2 text-center border-0 focus:outline-none focus:ring-0"
                      />
                      <button
                        onClick={increaseQuantity}
                        disabled={!product || quantity >= product.quantity}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                        </svg>
                      </button>
                    </div>
                    <span className="text-sm text-gray-600">
                      {product?.quantity > 0 && `(${product.quantity} available)`}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      {cartP.some((item) => item.id === product.id) ? (
                        <button
                          onClick={handleRemFromCart}
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-medium text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove From Cart
                        </button>
                      ) : (
                        <button
                          onClick={handleAddToCart}
                          disabled={!product.status}
                          className={`flex-1 px-6 py-3 rounded-lg font-medium text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 ${
                            product.status
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5m6.5-2.5L19 16" />
                          </svg>
                          {product.status ? "Add to Cart" : "Out of Stock"}
                        </button>
                      )}
                    </div>
                    
                   
                  </div>

                  {/* Product Details Card */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Product Specifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-1">
                          <span className="font-medium text-gray-600 text-sm">Category:</span>
                          <span className="text-gray-900 font-medium text-sm">{product.category}</span>
                        </div>
                        {product.brand && (
                          <div className="flex justify-between items-center py-1">
                            <span className="font-medium text-gray-600 text-sm">Brand:</span>
                            <span className="text-gray-900 font-medium text-sm">{product.brand}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center py-1">
                          <span className="font-medium text-gray-600 text-sm">Product ID:</span>
                          <span className="text-gray-900 font-mono text-xs bg-gray-200 px-2 py-1 rounded">{product.id}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-1">
                          <span className="font-medium text-gray-600 text-sm">Availability:</span>
                          <span className="text-gray-900 font-medium text-sm">{product.quantity} units</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="font-medium text-gray-600 text-sm">Rating:</span>
                          <span className="text-gray-900 font-medium text-sm">{product.rating}/5 ⭐</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="font-medium text-gray-600 text-sm">Status:</span>
                          <span className={`font-medium text-sm ${product.status ? 'text-green-600' : 'text-red-600'}`}>
                            {product.status ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center space-y-3">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-300 animate-ping"></div>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-semibold text-gray-800">Loading Product Details</p>
                <p className="text-gray-600 text-sm">Please wait while we fetch the product information...</p>
              </div>
            </div>
          </div>
        )}
        <ToastContainer 
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="!bottom-4 !right-4"
        />
      </div>
    </div>
  );
};

export default ProductDetail;