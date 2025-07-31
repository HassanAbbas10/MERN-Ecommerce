import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react"

const salesData = [
  { month: "Jan", sales: 12000, orders: 145 },
  { month: "Feb", sales: 15000, orders: 178 },
  { month: "Mar", sales: 18000, orders: 210 },
  { month: "Apr", sales: 22000, orders: 245 },
  { month: "May", sales: 25000, orders: 289 },
  { month: "Jun", sales: 28000, orders: 312 },
]

const userEngagementData = [
  { day: "Mon", visitors: 1200, pageViews: 3400 },
  { day: "Tue", visitors: 1100, pageViews: 3100 },
  { day: "Wed", visitors: 1400, pageViews: 3800 },
  { day: "Thu", visitors: 1300, pageViews: 3600 },
  { day: "Fri", visitors: 1600, pageViews: 4200 },
  { day: "Sat", visitors: 1800, pageViews: 4800 },
  { day: "Sun", visitors: 1500, pageViews: 4000 },
]

const productPerformanceData = [
  { name: "Electronics", value: 35, color: "#000000" },
  { name: "Clothing", value: 25, color: "#404040" },
  { name: "Home & Garden", value: 20, color: "#808080" },
  { name: "Sports", value: 12, color: "#a0a0a0" },
  { name: "Books", value: 8, color: "#c0c0c0" },
]

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
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-black">Dashboard</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">$120,000</div>
            <p className="text-xs text-gray-600">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">1,379</div>
            <p className="text-xs text-gray-600">+15.3% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Active Users</CardTitle>
            <Users className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">8,429</div>
            <p className="text-xs text-gray-600">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Products</CardTitle>
            <Package className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">573</div>
            <p className="text-xs text-gray-600">+8 new this week</p>
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
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sales" fill="#000000" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="orders" fill="#404040" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Product Categories</CardTitle>
            <CardDescription className="text-gray-600">Sales distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productPerformanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {productPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {productPerformanceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-black">{item.name}</span>
                  </div>
                  <span className="text-gray-600">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">User Engagement</CardTitle>
            <CardDescription className="text-gray-600">Daily visitors and page views</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userEngagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="day" stroke="#666" />
                  <YAxis stroke="#666" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="#000000"
                    strokeWidth={3}
                    dot={{ fill: "#000000", strokeWidth: 2, r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pageViews"
                    stroke="#404040"
                    strokeWidth={3}
                    dot={{ fill: "#404040", strokeWidth: 2, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Revenue Growth</CardTitle>
            <CardDescription className="text-gray-600">Monthly revenue comparison</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sales" fill="#000000" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
