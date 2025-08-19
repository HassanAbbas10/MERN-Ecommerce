import { useState, useEffect, lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { remFromCart, clearCart } from "@/Redux/cartSlice";
import { orderAPI, authAPI } from "../services/api/apiService";
import { useAuth } from "../context/AuthContext";

// Lazy load animation component
const LottieAnimation = lazy(() => import("@/components/Lotte/LotteAnimation"));

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [amount, setTotalAmount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });
  const cart = useSelector((state) => state.cart.cart);

  useEffect(() => {
    if (Array.isArray(cart)) {
      setTotalAmount(
        cart.reduce((acc, curr) => acc + curr.price * (curr.quantity || 1), 0)
      );
    }
  }, [cart]);

  const handleRemove = (item) => {
    dispatch(remFromCart(item));
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setShowCheckoutForm(true);
  };

  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setIsCheckingOut(true);

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      alert("Please log in to place an order");
      navigate("/login");
      setIsCheckingOut(false);
      return;
    }

    // Check if cart is not empty
    if (!cart || cart.length === 0) {
      alert("Your cart is empty");
      setIsCheckingOut(false);
      return;
    }

    try {
      console.log("=== DEBUGGING USER DATA ===");
      console.log("isAuthenticated:", isAuthenticated);
      console.log("user:", user);
      console.log("user type:", typeof user);
      console.log("user keys:", Object.keys(user || {}));
      console.log("user._id:", user?._id);
      console.log("user.id:", user?.id);
      console.log("localStorage accessToken:", localStorage.getItem('accessToken'));
      console.log("================================");
      
      let userId = null;
      
      // Try multiple ways to get userId
      if (user) {
        userId = user._id || user.id || user.userId;
        console.log("Extracted userId from user object:", userId);
      }
      
      // Fallback: try to get user info from API if direct user object doesn't work
      if (!userId) {
        console.log("No userId found in user object, trying API...");
        try {
          const userData = await authAPI.getCurrentUser();
          console.log("API response:", userData);
          if (userData && userData.data) {
            userId = userData.data._id || userData.data.id || userData.data.userId;
            console.log("Retrieved userId from API:", userId);
          }
        } catch (apiError) {
          console.error("Failed to fetch current user:", apiError);
        }
      }
      
      // Last resort: try to extract from token payload (decode JWT manually)
      if (!userId) {
        console.log("Still no userId, trying to extract from token...");
        const token = localStorage.getItem('accessToken');
        if (token) {
          try {
            // Decode JWT payload (simple base64 decode - not for verification, just data extraction)
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log("Token payload:", payload);
            userId = payload._id || payload.id || payload.userId || payload.sub;
            console.log("Extracted userId from token:", userId);
          } catch (tokenError) {
            console.error("Failed to decode token:", tokenError);
          }
        }
      }
      
      console.log("Final resolved userId:", userId);
      
      if (!userId) {
        alert("User ID not found. Please log out and log in again.");
        console.error("Critical: No userId found anywhere!");
        setIsCheckingOut(false);
        return;
      }
      
      const orderData = {
        userId: userId, // Add userId to the order data
        items: cart.map(item => ({
          product: item._id, // Use _id instead of id for MongoDB
          quantity: item.quantity || 1,
        })),
        shippingAddress: {
          fullName: shippingInfo.fullName,
          street: shippingInfo.address, // Map address to street
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: parseInt(shippingInfo.zipCode),
          country: shippingInfo.country,
          phone: shippingInfo.phone,
        },
        paymentMethod: "Cash on Delivery",
        subTotal: amount, // Use subTotal instead of subtotal
        tax: 0,
        shippingCost: 0,
        discount: 0,
      };

      console.log("Sending order data:", orderData);
      console.log("Order data userId:", orderData.userId);
      console.log("Order data type check:", typeof orderData.userId);
      
      const response = await orderAPI.createOrder(orderData);
      console.log("Order response:", response);

      if (response.success) {
        dispatch(clearCart());
        alert("Order created successfully!");
        navigate("/orders");
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      console.error("Error response:", error.response?.data);
      alert(
        `Failed to create order: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">
              {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>
        </div>

        {cart.length > 0 ? (
          <>
            {!showCheckoutForm ? (
              // ...existing cart display code...
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="divide-y divide-gray-200">
                      {cart.map((item, index) => (
                        <div key={`${item._id}-${index}`} className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 relative">
                              <img
                                src={item.images[0]}
                                alt={item.name}
                                className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                              />
                              {/* Custom logo overlay for custom products */}
                              {item.isCustom && item.customization && (
                                <div className="absolute inset-0 rounded-lg overflow-hidden">
                                  <img
                                    src={item.customization.customLogo}
                                    alt="Custom logo"
                                    className="absolute object-contain"
                                    style={{
                                      left: `${(item.customization.position.x / 400) * 100}%`,
                                      top: `${(item.customization.position.y / 500) * 100}%`,
                                      width: `${(item.customization.size.width / 400) * 100}%`,
                                      height: `${(item.customization.size.height / 500) * 100}%`,
                                      transform: 'translate(-50%, -50%)'
                                    }}
                                  />
                                </div>
                              )}
                              {item.isCustom && (
                                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                                  Custom
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {item.name}
                                {item.isCustom && item.customization?.customizationName && (
                                  <span className="text-purple-600 text-sm ml-2">
                                    ({item.customization.customizationName})
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-500 mb-1">
                                SKU: #{item._id}
                              </p>
                              {item.isCustom && (
                                <p className="text-sm text-purple-600 mb-1">
                                  ✨ Custom Design
                                </p>
                              )}
                              <p className="text-sm text-gray-500 mb-3">
                                Quantity: {item.quantity || 1}
                              </p>
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-sm text-gray-500">
                                    Unit Price: Rs {item.price.toLocaleString()}
                                  </span>
                                  <span className="text-2xl font-bold text-blue-600 ml-4">
                                    Rs{" "}
                                    {(
                                      item.price * (item.quantity || 1)
                                    ).toLocaleString()}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleRemove(item)}
                                  className="text-red-600 hover:text-red-800 font-medium text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Order Summary
                      </h2>
                    </div>
                    <div className="px-6 py-4 space-y-4">
                      <div className="flex justify-between text-base text-gray-600">
                        <p>
                          Subtotal ({cart.length}{" "}
                          {cart.length === 1 ? "item" : "items"})
                        </p>
                        <p>Rs {amount.toLocaleString()}</p>
                      </div>
                      <div className="flex justify-between text-base text-gray-600">
                        <p>Shipping</p>
                        <p>Free</p>
                      </div>
                      <div className="flex justify-between text-base text-gray-600">
                        <p>Tax</p>
                        <p>Rs 0</p>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between text-lg font-bold text-gray-900">
                          <p>Total</p>
                          <p>Rs {amount.toLocaleString()}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleProceedToCheckout}
                        className="w-full bg-blue-600 border border-transparent rounded-md py-3 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        Proceed to Checkout
                      </button>
                      <button className="w-full bg-gray-100 border border-gray-300 rounded-md py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200">
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Checkout Form */
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Checkout
                    </h2>
                    <button
                      onClick={() => setShowCheckoutForm(false)}
                      className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                    >
                      ← Back to Cart
                    </button>
                  </div>

                  <form onSubmit={handleCreateOrder} className="px-6 py-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Shipping Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label
                              htmlFor="fullName"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Full Name
                            </label>
                            <input
                              type="text"
                              id="fullName"
                              name="fullName"
                              required
                              value={shippingInfo.fullName}
                              onChange={handleShippingInfoChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="address"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Address
                            </label>
                            <textarea
                              id="address"
                              name="address"
                              required
                              rows={3}
                              value={shippingInfo.address}
                              onChange={handleShippingInfoChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor="city"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                City
                              </label>
                              <input
                                type="text"
                                id="city"
                                name="city"
                                required
                                value={shippingInfo.city}
                                onChange={handleShippingInfoChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="state"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                State
                              </label>
                              <input
                                type="text"
                                id="state"
                                name="state"
                                required
                                value={shippingInfo.state}
                                onChange={handleShippingInfoChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor="zipCode"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                ZIP Code
                              </label>
                              <input
                                type="number"
                                id="zipCode"
                                name="zipCode"
                                required
                                value={shippingInfo.zipCode}
                                onChange={handleShippingInfoChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="country"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Country
                              </label>
                              <input
                                type="text"
                                id="country"
                                name="country"
                                required
                                value={shippingInfo.country}
                                onChange={handleShippingInfoChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Pakistan"
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="phone"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              required
                              value={shippingInfo.phone}
                              onChange={handleShippingInfoChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Order Summary
                        </h3>
                        <div className="space-y-2">
                          {cart.map((item, index) => (
                            <div
                              key={`checkout-${item._id}-${index}`}
                              className="flex justify-between text-sm"
                            >
                              <span>
                                {item.name} (x{item.quantity || 1})
                              </span>
                              <span>
                                Rs{" "}
                                {(
                                  item.price * (item.quantity || 1)
                                ).toLocaleString()}
                              </span>
                            </div>
                          ))}
                          <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between font-semibold">
                              <span>Total</span>
                              <span>Rs {amount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <button
                          type="submit"
                          disabled={isCheckingOut}
                          className="w-full bg-green-600 border border-transparent rounded-md py-3 px-4 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isCheckingOut
                            ? "Creating Order..."
                            : "Place Order (Cash on Delivery)"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col justify-center items-center py-16">
              <Suspense fallback={<div className="w-32 h-32 bg-gray-200 rounded-lg animate-pulse"></div>}>
                <LottieAnimation />
              </Suspense>
              <div className="text-center mt-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-6">
                  Looks like you haven&apos;t added any items to your cart yet.
                </p>
                <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                  Start Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
