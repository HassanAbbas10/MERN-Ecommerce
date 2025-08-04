import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown } from "lucide-react"
import { dashboardAPI } from "@/services/api/apiService";

const chartConfig = {
  sales: {
    label: "Sales",
    color: "#000000",
  },
  orders: {
    label: "Orders",
    color: "#404040",
  },
  visitors: {
    label: "Visitors",
    color: "#000000",
  },
  pageViews: {
    label: "Page Views",
    color: "#404040",
  },
}

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getAnalytics();
      if (response.success) {
        setAnalytics(response.data);
      } else {
        setError("Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount);
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

  if (loading) {
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
            onClick={fetchDashboardData}
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { overview, charts, recentOrders } = analytics;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-black">Dashboard</h2>
        <button
          onClick={fetchDashboardData}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{formatCurrency(overview.totalRevenue)}</div>
            {formatPercentage(overview.revenueChange)}
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{overview.totalOrders.toLocaleString()}</div>
            {formatPercentage(overview.ordersChange)}
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Active Users</CardTitle>
            <Users className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{overview.totalUsers.toLocaleString()}</div>
            {formatPercentage(overview.usersChange)}
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Products</CardTitle>
            <Package className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{overview.totalProducts.toLocaleString()}</div>
            <p className="text-xs text-gray-600">+{overview.newProductsThisWeek} new this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Sales Overview</CardTitle>
            <CardDescription className="text-gray-600">Monthly sales and order trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="sales" 
                    fill="#000000" 
                    radius={[4, 4, 0, 0]}
                    name="Sales ($)"
                  />
                  <Bar 
                    dataKey="orders" 
                    fill="#404040" 
                    radius={[4, 4, 0, 0]}
                    name="Orders"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Product Categories</CardTitle>
            <CardDescription className="text-gray-600">Product distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {charts.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {charts.categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm capitalize font-medium text-black">{item.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Recent Orders</CardTitle>
          <CardDescription className="text-gray-600">Latest customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.slice(0, 5).map((order) => (
              <div key={order._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {order.items[0]?.image && (
                      <img 
                        src={order.items[0].image} 
                        alt={order.items[0].name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-black">#{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.fullName} • {order.items.length} items
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-black">{formatCurrency(order.totalAmount)}</p>
                  <p className={`text-sm capitalize px-2 py-1 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
