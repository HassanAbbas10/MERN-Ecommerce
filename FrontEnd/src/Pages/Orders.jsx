"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, Download } from "lucide-react"

const orders = [
  {
    id: "#ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    total: 299.99,
    status: "Completed",
    date: "2024-01-15",
    items: 3,
  },
  {
    id: "#ORD-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    total: 149.5,
    status: "Processing",
    date: "2024-01-14",
    items: 2,
  },
  {
    id: "#ORD-003",
    customer: "Mike Johnson",
    email: "mike@example.com",
    total: 89.99,
    status: "Shipped",
    date: "2024-01-13",
    items: 1,
  },
  {
    id: "#ORD-004",
    customer: "Sarah Wilson",
    email: "sarah@example.com",
    total: 199.99,
    status: "Pending",
    date: "2024-01-12",
    items: 4,
  },
  {
    id: "#ORD-005",
    customer: "David Brown",
    email: "david@example.com",
    total: 79.99,
    status: "Cancelled",
    date: "2024-01-11",
    items: 1,
  },
]

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-black text-white">Completed</Badge>
      case "Processing":
        return (
          <Badge variant="outline" className="border-blue-400 text-blue-700">
            Processing
          </Badge>
        )
      case "Shipped":
        return (
          <Badge variant="outline" className="border-green-400 text-green-700">
            Shipped
          </Badge>
        )
      case "Pending":
        return (
          <Badge variant="outline" className="border-yellow-400 text-yellow-700">
            Pending
          </Badge>
        )
      case "Cancelled":
        return (
          <Badge variant="outline" className="border-red-400 text-red-700">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black">Orders</h2>
          <p className="text-gray-600">Manage customer orders and fulfillment</p>
        </div>
        <Button className="bg-black text-white hover:bg-gray-800">
          <Download className="mr-2 h-4 w-4" />
          Export Orders
        </Button>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Recent Orders</CardTitle>
          <CardDescription className="text-gray-600">View and manage all customer orders</CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm border-gray-300"
            />
          </div>
        </CardHeader>
        <CardContent>
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
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="border-gray-200">
                  <TableCell className="font-medium text-black">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-black">{order.customer}</div>
                      <div className="text-sm text-gray-600">{order.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{order.items} items</TableCell>
                  <TableCell className="text-black font-medium">${order.total}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-gray-600">{order.date}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-black">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
