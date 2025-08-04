import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { orderAPI } from "../services/api/apiService";
import { useNavigate } from "react-router-dom";
import { Calendar, Package, Truck, CheckCircle, XCircle, Eye } from "lucide-react";

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAllOrders();
      if (response.success) {
        setOrders(response.data || []);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Package className="w-5 h-5 text-yellow-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `Rs ${amount.toLocaleString()}`;
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setShowOrderDetails(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={fetchOrders}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">
              Track and manage your orders
            </p>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col justify-center items-center py-16">
              <Package className="w-16 h-16 text-gray-400 mb-4" />
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-600 mb-6">
                  You haven&apos;t placed any orders yet. Start shopping!
                </p>
                <button
                  onClick={() => navigate("/products")}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Start Shopping
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="px-6 py-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(order.createdAt)}
                        </div>
                        <div>
                          {order.items.length} {order.items.length === 1 ? "item" : "items"}
                        </div>
                        <div className="font-medium text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 lg:mt-0 lg:ml-4">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} × {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        +{order.items.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeOrderDetails}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Order Details - #{selectedOrder.orderNumber}
                  </h3>
                  <button
                    onClick={closeOrderDetails}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Order Status */}
                  <div className="flex items-center space-x-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {getStatusIcon(selectedOrder.status)}
                      <span className="ml-2 capitalize">{selectedOrder.status}</span>
                    </span>
                    <span className="text-sm text-gray-600">
                      Ordered on {formatDate(selectedOrder.createdAt)}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 py-3 border-b border-gray-200 last:border-b-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-sm text-gray-600">
                              Price: {formatCurrency(item.price)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Shipping Address</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.shippingAddress.street}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.shippingAddress.country}
                      </p>
                      <p className="text-sm text-gray-600">
                        Phone: {selectedOrder.shippingAddress.phone}
                      </p>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(selectedOrder.subTotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax:</span>
                        <span>{formatCurrency(selectedOrder.tax)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping:</span>
                        <span>{formatCurrency(selectedOrder.shippingCost)}</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount:</span>
                          <span>-{formatCurrency(selectedOrder.discount)}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 pt-2">
                        <div className="flex justify-between font-medium">
                          <span>Total:</span>
                          <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Payment Method</h4>
                    <p className="text-sm text-gray-600">{selectedOrder.paymentMethod}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
