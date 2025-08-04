"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Download, TrendingUp, TrendingDown, X, Mail, Phone } from "lucide-react"
import { orderAPI } from "@/services/api/apiService"

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0
  });

  const fetchOrdersData = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 20,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      };
      
      const response = await orderAPI.getAdminOrders(params);
      if (response.success) {
        setOrders(response.data.orders || response.data);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      } else {
        setError("Failed to fetch orders");
      }
    } catch (err) {
      console.error("Orders fetch error:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  const fetchOrderStats = useCallback(async () => {
    try {
      const response = await orderAPI.getOrderStats();
      if (response.success) {
        setOrderStats(response.data);
      }
    } catch (err) {
      console.error("Order stats fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchOrdersData();
    fetchOrderStats();
  }, [fetchOrdersData, fetchOrderStats]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchOrdersData();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, statusFilter, fetchOrdersData]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      await orderAPI.updateAdminOrderStatus(orderId, { status: newStatus });
      
      // Update the order in the local state immediately
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      fetchOrderStats(); // Refresh stats
    } catch (err) {
      console.error("Status update error:", err);
      setError("Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const response = await orderAPI.getOrderById(orderId);
      if (response.success) {
        setSelectedOrder(response.data);
        setShowOrderModal(true);
      }
    } catch (err) {
      console.error("Failed to fetch order details:", err);
      setError("Failed to load order details");
    }
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPercentage = (value) => {
    const isPositive = value >= 0;
    return (
      <span className={`text-xs flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
        {isPositive ? '+' : ''}{value.toFixed(1)}% from last month
      </span>
    );
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
      case "shipped":
        return <Badge className="bg-purple-100 text-purple-800">Shipped</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading && orders.length === 0) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            onClick={() => fetchOrdersData()}
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black">Orders</h2>
          <p className="text-gray-600">Manage and track customer orders</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => fetchOrdersData()}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
          >
            Refresh Data
          </button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{orderStats?.totalOrders?.toLocaleString() || 0}</div>
            {orderStats?.ordersChange !== undefined && formatPercentage(orderStats.ordersChange)}
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{orderStats?.pendingOrders?.toLocaleString() || 0}</div>
            <p className="text-xs text-gray-600">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{formatCurrency(orderStats?.totalRevenue)}</div>
            {orderStats?.revenueChange !== undefined && formatPercentage(orderStats.revenueChange)}
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Avg. Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{formatCurrency(orderStats?.avgOrderValue)}</div>
            <p className="text-xs text-gray-600">Per order</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Order Management</CardTitle>
          <CardDescription className="text-gray-600">
            View and manage customer orders ({pagination.totalOrders || orders.length} total orders)
          </CardDescription>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm border-gray-300"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white border-gray-600">
                <SelectItem value="all" className="text-white hover:bg-gray-800 focus:bg-gray-800">All Status</SelectItem>
                <SelectItem value="pending" className="text-white hover:bg-gray-800 focus:bg-gray-800">Pending</SelectItem>
                <SelectItem value="processing" className="text-white hover:bg-gray-800 focus:bg-gray-800">Processing</SelectItem>
                <SelectItem value="shipped" className="text-white hover:bg-gray-800 focus:bg-gray-800">Shipped</SelectItem>
                <SelectItem value="delivered" className="text-white hover:bg-gray-800 focus:bg-gray-800">Delivered</SelectItem>
                <SelectItem value="cancelled" className="text-white hover:bg-gray-800 focus:bg-gray-800">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading && orders.length === 0 ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200">
                    <TableHead className="text-black">Order ID</TableHead>
                    <TableHead className="text-black">Customer</TableHead>
                    <TableHead className="text-black">Items</TableHead>
                    <TableHead className="text-black">Total</TableHead>
                    <TableHead className="text-black">Status</TableHead>
                    <TableHead className="text-black">Date</TableHead>
                    <TableHead className="text-black">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id} className="border-gray-200">
                      <TableCell className="font-medium text-black">#{order.orderNumber || order._id.slice(-6)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-black">{order.shippingAddress?.fullName || 'N/A'}</div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-3 w-3 mr-1" />
                            {order.userId?.email || 'Email not available'}
                          </div>
                          {order.shippingAddress?.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-3 w-3 mr-1" />
                              {order.shippingAddress.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{order.items?.length || 0} items</TableCell>
                      <TableCell className="text-black font-medium">{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell>
                        <Select 
                          value={order.status} 
                          onValueChange={(newStatus) => handleStatusUpdate(order._id, newStatus)}
                          disabled={updatingStatus}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-black text-white border-gray-600">
                            <SelectItem value="pending" className="text-white hover:bg-gray-800 focus:bg-gray-800">Pending</SelectItem>
                            <SelectItem value="processing" className="text-white hover:bg-gray-800 focus:bg-gray-800">Processing</SelectItem>
                            <SelectItem value="shipped" className="text-white hover:bg-gray-800 focus:bg-gray-800">Shipped</SelectItem>
                            <SelectItem value="delivered" className="text-white hover:bg-gray-800 focus:bg-gray-800">Delivered</SelectItem>
                            <SelectItem value="cancelled" className="text-white hover:bg-gray-800 focus:bg-gray-800">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-gray-600">{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-600 hover:text-black"
                            onClick={() => handleViewOrder(order._id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-black">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between space-x-2 py-4">
                  <div className="text-sm text-gray-600">
                    Showing {((pagination.currentPage - 1) * 20) + 1} to {Math.min(pagination.currentPage * 20, pagination.totalOrders)} of {pagination.totalOrders} orders
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchOrdersData(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage || loading}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchOrdersData(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage || loading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto m-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-black">Order Details</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={closeOrderModal}
                className="text-gray-600 hover:text-black"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Order Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">#{selectedOrder.orderNumber || selectedOrder._id.slice(-6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Select 
                      value={selectedOrder.status} 
                      onValueChange={(newStatus) => {
                        handleStatusUpdate(selectedOrder._id, newStatus);
                        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
                      }}
                      disabled={updatingStatus}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black text-white border-gray-600">
                        <SelectItem value="pending" className="text-white hover:bg-gray-800 focus:bg-gray-800">Pending</SelectItem>
                        <SelectItem value="processing" className="text-white hover:bg-gray-800 focus:bg-gray-800">Processing</SelectItem>
                        <SelectItem value="shipped" className="text-white hover:bg-gray-800 focus:bg-gray-800">Shipped</SelectItem>
                        <SelectItem value="delivered" className="text-white hover:bg-gray-800 focus:bg-gray-800">Delivered</SelectItem>
                        <SelectItem value="cancelled" className="text-white hover:bg-gray-800 focus:bg-gray-800">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{selectedOrder.paymentMethod || 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{selectedOrder.shippingAddress?.fullName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedOrder.userId?.email || 'Email not available'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{selectedOrder.shippingAddress?.phone || 'N/A'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-gray-600">Shipping Address:</span>
                    <div className="text-sm font-medium">
                      {selectedOrder.shippingAddress?.street}<br />
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}<br />
                      {selectedOrder.shippingAddress?.zipCode} {selectedOrder.shippingAddress?.country}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Items */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {item.product?.images?.[0] && (
                              <img 
                                src={item.product.images[0]} 
                                alt={item.product?.name || item.name} 
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <span className="font-medium">{item.product?.name || item.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                        <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Order Summary */}
                <div className="mt-6 space-y-2 max-w-sm ml-auto">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedOrder.subTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{formatCurrency(selectedOrder.shippingCost)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-{formatCurrency(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
