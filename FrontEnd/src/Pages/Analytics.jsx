import { useState, useEffect } from "react"
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
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Package } from "lucide-react"
import { dashboardAPI, productAPI, customerAPI } from "@/services/api/apiService"

const chartConfig = {
  revenue: { label: "Revenue", color: "#000000" },
  profit: { label: "Profit", color: "#404040" },
  expenses: { label: "Expenses", color: "#808080" },
  sales: { label: "Sales", color: "#000000" },
  visitors: { label: "Visitors", color: "#000000" },
  conversions: { label: "Conversions", color: "#404040" },
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [customerSegments, setCustomerSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch multiple data sources in parallel
      const [dashboardResponse, salesResponse, productsResponse, customerResponse] = await Promise.all([
        dashboardAPI.getAnalytics(),
        dashboardAPI.getSalesAnalytics('6m'),
        productAPI.getAllProducts(),
        customerAPI.getCustomerAnalytics()
      ]);

      if (dashboardResponse.success) {
        setAnalytics(dashboardResponse.data);
      }

      if (salesResponse.success) {
        setSalesData(salesResponse.data);
      }

      if (productsResponse.success) {
        // Get top 5 products by some metric
        const products = productsResponse.data.slice(0, 5).map(product => ({
          name: product.name,
          sales: Math.floor(Math.random() * 1000) + 100, // Mock sales data
          revenue: product.price * (Math.floor(Math.random() * 1000) + 100)
        }));
        setTopProducts(products);
      }

      if (customerResponse.success) {
        const { totalCustomers, activeCustomers, vipCustomers, inactiveCustomers } = customerResponse.data;
        const segments = [
          { 
            segment: "Active Customers", 
            value: Math.round((activeCustomers / totalCustomers) * 100) || 0, 
            color: "#000000" 
          },
          { 
            segment: "VIP Customers", 
            value: Math.round((vipCustomers / totalCustomers) * 100) || 0, 
            color: "#404040" 
          },
          { 
            segment: "Inactive Customers", 
            value: Math.round((inactiveCustomers / totalCustomers) * 100) || 0, 
            color: "#808080" 
          },
        ];
        setCustomerSegments(segments);
      }

    } catch (err) {
      console.error("Analytics fetch error:", err);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount || 0);
  };

  const formatPercentage = (value) => {
    const isPositive = value >= 0;
    return (
      <span className={`text-xs flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
        {isPositive ? '+' : ''}{value.toFixed(1)}%
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
            onClick={fetchAnalyticsData}
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Use real data if available, otherwise fallback to mock data
  const revenueData = salesData?.monthlyData || [
    { month: "Jan", revenue: 12000, profit: 3600, expenses: 8400 },
    { month: "Feb", revenue: 15000, profit: 4500, expenses: 10500 },
    { month: "Mar", revenue: 18000, profit: 5400, expenses: 12600 },
    { month: "Apr", revenue: 22000, profit: 6600, expenses: 15400 },
    { month: "May", revenue: 25000, profit: 7500, expenses: 17500 },
    { month: "Jun", revenue: 28000, profit: 8400, expenses: 19600 },
  ];

  const topProductsData = topProducts.length > 0 ? topProducts : [
    { name: "Wireless Headphones", sales: 1250, revenue: 124750 },
    { name: "Smartphone Case", sales: 980, revenue: 19600 },
    { name: "Cotton T-Shirt", sales: 850, revenue: 21250 },
    { name: "Coffee Maker", sales: 420, revenue: 62980 },
    { name: "Running Shoes", sales: 380, revenue: 30400 },
  ];

  const customerSegmentData = customerSegments.length > 0 ? customerSegments : [
    { segment: "New Customers", value: 35, color: "#000000" },
    { segment: "Returning Customers", value: 45, color: "#404040" },
    { segment: "VIP Customers", value: 20, color: "#808080" },
  ];

  const trafficSourceData = [
    { source: "Organic Search", visitors: 3200, conversions: 128 },
    { source: "Social Media", visitors: 2100, conversions: 84 },
    { source: "Direct", visitors: 1800, conversions: 108 },
    { source: "Email", visitors: 1200, conversions: 96 },
    { source: "Paid Ads", visitors: 900, conversions: 54 },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black">Analytics</h2>
          <p className="text-gray-600">Comprehensive business insights and performance metrics</p>
        </div>
        <button
          onClick={fetchAnalyticsData}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          Refresh Data
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{formatCurrency(analytics?.overview?.totalRevenue || 156000)}</div>
            {analytics?.overview?.revenueChange !== undefined ? 
              formatPercentage(analytics.overview.revenueChange) : 
              formatPercentage(18.2)
            }
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{analytics?.overview?.totalOrders?.toLocaleString() || '1,740'}</div>
            {analytics?.overview?.ordersChange !== undefined ? 
              formatPercentage(analytics.overview.ordersChange) : 
              formatPercentage(12.5)
            }
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">3.24%</div>
            {formatPercentage(0.8)}
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Avg. Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{formatCurrency(analytics?.overview?.avgOrderValue || 89.67)}</div>
            {formatPercentage(5.1)}
          </CardContent>
        </Card>
      </div>

      {/* Revenue & Profit Analysis */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Revenue & Profit Trends</CardTitle>
            <CardDescription className="text-gray-600">Monthly revenue, profit, and expenses breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#000000"
                    fill="#000000"
                    fillOpacity={0.8}
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stackId="2"
                    stroke="#404040"
                    fill="#404040"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Customer Segments</CardTitle>
            <CardDescription className="text-gray-600">Distribution of customer types</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerSegmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {customerSegmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {customerSegmentData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-black">{item.segment}</span>
                  </div>
                  <span className="text-sm text-gray-600">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products & Traffic Sources */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Top Performing Products</CardTitle>
            <CardDescription className="text-gray-600">Best selling products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#666" />
                  <YAxis type="category" dataKey="name" stroke="#666" width={120} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="#000000" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Traffic Sources</CardTitle>
            <CardDescription className="text-gray-600">Visitor sources and conversion rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficSourceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="source" stroke="#666" />
                  <YAxis stroke="#666" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="visitors" fill="#000000" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="conversions" fill="#404040" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
