import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { remFromCart, clearCart } from "@/Redux/cartSlice";
import { orderAPI } from "../services/api/apiService";
import { useAuth } from "../context/AuthContext";
import { ShoppingCart, Trash2, ArrowLeft, Package, CreditCard, Truck } from "lucide-react";
import LottieAnimation from "@/components/Lotte/LotteAnimation";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
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
      setTotalAmount(cart.reduce((acc, curr) => acc + (curr.price * (curr.quantity || 1)), 0));
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
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setIsCheckingOut(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          product: item._id,
          quantity: item.quantity || 1,
        })),
        shippingAddress: {
          fullName: shippingInfo.fullName,
          street: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: parseInt(shippingInfo.zipCode),
          country: shippingInfo.country,
          phone: shippingInfo.phone,
        },
        paymentMethod: "Cash on Delivery",
        subTotal: amount,
        tax: 0,
        shippingCost: 0,
        discount: 0,
      };

      console.log("Sending order data:", orderData);
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
      alert(`Failed to create order: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="px-6 py-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-gray-600 mt-1">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
              </div>
            </div>
          </div>
        </div>

        {cart.length > 0 ? (
          <>
            {!showCheckoutForm ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="divide-y divide-gray-100">
                      {cart.map((item, index) => (
                        <div key={`${item._id}-${index}`} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                                <img 
                                  src={item.images[0]} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
                              <div className="space-y-1 mb-4">
                                <p className="text-sm text-gray-500">SKU: #{item._id}</p>
                                <p className="text-sm text-gray-500">Quantity: {item.quantity || 1}</p>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <p className="text-sm text-gray-500">Unit Price: Rs {item.price.toLocaleString()}</p>
                                  <p className="text-xl font-bold text-primary-600">
                                    Rs {(item.price * (item.quantity || 1)).toLocaleString()}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleRemove(item)}
                                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors duration-200"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span className="text-sm font-medium">Remove</span>
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
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-8">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                    </div>
                    <div className="px-6 py-6 space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
                          <span>Rs {amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span className="flex items-center space-x-2">
                            <Truck className="w-4 h-4" />
                            <span>Shipping</span>
                          </span>
                          <span className="text-green-600 font-medium">Free</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Tax</span>
                          <span>Rs 0</span>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between text-xl font-bold text-gray-900">
                          <span>Total</span>
                          <span>Rs {amount.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="space-y-3 pt-4">
                        <button 
                          onClick={handleProceedToCheckout}
                          className="btn-primary w-full flex items-center justify-center space-x-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Proceed to Checkout</span>
                        </button>
                        <button 
                          onClick={() => navigate('/')}
                          className="btn-secondary w-full flex items-center justify-center space-x-2"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Continue Shopping</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Checkout Form
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="px-6 py-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold text-gray-900">Checkout</h2>
                      <button 
                        onClick={() => setShowCheckoutForm(false)}
                        className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Cart</span>
                      </button>
                    </div>
                  </div>
                  
                  <form onSubmit={handleCreateOrder} className="px-6 py-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                          <Package className="w-5 h-5" />
                          <span>Shipping Information</span>
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="form-group">
                            <input
                              type="text"
                              id="fullName"
                              name="fullName"
                              required
                              value={shippingInfo.fullName}
                              onChange={handleShippingInfoChange}
                              className="form-input peer"
                              placeholder="Full Name"
                            />
                            <label className="form-label peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-required:after:content-['*'] peer-required:after:text-red-400 peer-focus:-top-2 peer-focus:text-xs">
                              Full Name
                            </label>
                          </div>
                          
                          <div className="form-group">
                            <textarea
                              id="address"
                              name="address"
                              required
                              rows={3}
                              value={shippingInfo.address}
                              onChange={handleShippingInfoChange}
                              className="form-input peer"
                              placeholder="Address"
                            />
                            <label className="form-label peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-required:after:content-['*'] peer-required:after:text-red-400 peer-focus:-top-2 peer-focus:text-xs">
                              Address
                            </label>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                              <input
                                type="text"
                                id="city"
                                name="city"
                                required
                                value={shippingInfo.city}
                                onChange={handleShippingInfoChange}
                                className="form-input peer"
                                placeholder="City"
                              />
                              <label className="form-label peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-required:after:content-['*'] peer-required:after:text-red-400 peer-focus:-top-2 peer-focus:text-xs">
                                City
                              </label>
                            </div>
                            <div className="form-group">
                              <input
                                type="text"
                                id="state"
                                name="state"
                                required
                                value={shippingInfo.state}
                                onChange={handleShippingInfoChange}
                                className="form-input peer"
                                placeholder="State"
                              />
                              <label className="form-label peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-required:after:content-['*'] peer-required:after:text-red-400 peer-focus:-top-2 peer-focus:text-xs">
                                State
                              </label>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                              <input
                                type="number"
                                id="zipCode"
                                name="zipCode"
                                required
                                value={shippingInfo.zipCode}
                                onChange={handleShippingInfoChange}
                                className="form-input peer"
                                placeholder="ZIP Code"
                              />
                              <label className="form-label peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-required:after:content-['*'] peer-required:after:text-red-400 peer-focus:-top-2 peer-focus:text-xs">
                                ZIP Code
                              </label>
                            </div>
                            <div className="form-group">
                              <input
                                type="text"
                                id="country"
                                name="country"
                                required
                                value={shippingInfo.country}
                                onChange={handleShippingInfoChange}
                                className="form-input peer"
                                placeholder="e.g., Pakistan"
                              />
                              <label className="form-label peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-required:after:content-['*'] peer-required:after:text-red-400 peer-focus:-top-2 peer-focus:text-xs">
                                Country
                              </label>
                            </div>
                          </div>
                          
                          <div className="form-group">
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              required
                              value={shippingInfo.phone}
                              onChange={handleShippingInfoChange}
                              className="form-input peer"
                              placeholder="Phone Number"
                            />
                            <label className="form-label peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-required:after:content-['*'] peer-required:after:text-red-400 peer-focus:-top-2 peer-focus:text-xs">
                              Phone Number
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                        <div className="space-y-2">
                          {cart.map((item, index) => (
                            <div key={`checkout-${item._id}-${index}`} className="flex justify-between text-sm">
                              <span>{item.name} (x{item.quantity || 1})</span>
                              <span>Rs {(item.price * (item.quantity || 1)).toLocaleString()}</span>
                            </div>
                          ))}
                          <div className="border-t border-gray-200 pt-2 mt-2">
                            <div className="flex justify-between font-semibold">
                              <span>Total</span>
                              <span>Rs {amount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-6">
                        <button
                          type="submit"
                          disabled={isCheckingOut}
                          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isCheckingOut ? "Creating Order..." : "Place Order (Cash on Delivery)"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        ) : (
          // Empty Cart
          <div className="text-center py-12">
            <div className="mx-auto max-w-md">
              <LottieAnimation />
              <h2 className="text-2xl font-semibold text-gray-900 mt-6">Your cart is empty</h2>
              <p className="text-gray-600 mt-2">Looks like you haven&apos;t added any items to your cart yet.</p>
              <button 
                onClick={() => navigate('/')}
                className="btn-primary mt-6 inline-flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Start Shopping</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
