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

const revenueData = [
  { month: "Jan", revenue: 12000, profit: 3600, expenses: 8400 },
  { month: "Feb", revenue: 15000, profit: 4500, expenses: 10500 },
  { month: "Mar", revenue: 18000, profit: 5400, expenses: 12600 },
  { month: "Apr", revenue: 22000, profit: 6600, expenses: 15400 },
  { month: "May", revenue: 25000, profit: 7500, expenses: 17500 },
  { month: "Jun", revenue: 28000, profit: 8400, expenses: 19600 },
]

const topProductsData = [
  { name: "Wireless Headphones", sales: 1250, revenue: 124750 },
  { name: "Smartphone Case", sales: 980, revenue: 19600 },
  { name: "Cotton T-Shirt", sales: 850, revenue: 21250 },
  { name: "Coffee Maker", sales: 420, revenue: 62980 },
  { name: "Running Shoes", sales: 380, revenue: 30400 },
]

const customerSegmentData = [
  { segment: "New Customers", value: 35, color: "#000000" },
  { segment: "Returning Customers", value: 45, color: "#404040" },
  { segment: "VIP Customers", value: 20, color: "#808080" },
]

const trafficSourceData = [
  { source: "Organic Search", visitors: 3200, conversions: 128 },
  { source: "Social Media", visitors: 2100, conversions: 84 },
  { source: "Direct", visitors: 1800, conversions: 108 },
  { source: "Email", visitors: 1200, conversions: 96 },
  { source: "Paid Ads", visitors: 900, conversions: 54 },
]

const chartConfig = {
  revenue: { label: "Revenue", color: "#000000" },
  profit: { label: "Profit", color: "#404040" },
  expenses: { label: "Expenses", color: "#808080" },
  sales: { label: "Sales", color: "#000000" },
  visitors: { label: "Visitors", color: "#000000" },
  conversions: { label: "Conversions", color: "#404040" },
}

export default function Analytics() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black">Analytics</h2>
          <p className="text-gray-600">Comprehensive insights into your e-commerce performance</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">3.2%</div>
            <p className="text-xs text-green-600">+0.4% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Avg. Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">$87.50</div>
            <p className="text-xs text-gray-600">+$5.20 from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Cart Abandonment</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">68.5%</div>
            <p className="text-xs text-red-600">+2.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Return Rate</CardTitle>
            <Package className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">2.8%</div>
            <p className="text-xs text-green-600">-0.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Analysis */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Revenue & Profit Analysis</CardTitle>
            <CardDescription className="text-gray-600">Monthly financial performance breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
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
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-black">{item.segment}</span>
                  </div>
                  <span className="text-gray-600">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Performance & Traffic */}
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis type="number" stroke="#666" />
                  <YAxis dataKey="name" type="category" stroke="#666" width={120} />
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
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
