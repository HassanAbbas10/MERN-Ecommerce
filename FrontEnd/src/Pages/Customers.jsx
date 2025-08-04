"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, Mail, Phone, TrendingUp, TrendingDown } from "lucide-react"
import { customerAPI } from "@/services/api/apiService"

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCustomers: 0
  });

  const fetchCustomersData = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 20,
        ...(searchTerm && { search: searchTerm })
      };
      
      const response = await customerAPI.getAllCustomers(params);
      if (response.success) {
        console.log("Customers data:", response.data); // Debug log
        setCustomers(response.data.customers);
        setPagination(response.data.pagination);
      } else {
        setError("Failed to fetch customers: " + (response.message || "Unknown error"));
        // Set empty data as fallback
        setCustomers([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalCustomers: 0
        });
      }
    } catch (err) {
      console.error("Customers fetch error:", err);
      setError("Failed to load customers: " + (err.message || "Network error"));
      // Set empty data as fallback
      setCustomers([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalCustomers: 0
      });
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  const fetchCustomerAnalytics = async () => {
    try {
      const response = await customerAPI.getCustomerAnalytics();
      if (response.success) {
        setAnalytics(response.data);
      } else {
        console.error("Customer analytics failed:", response.message);
        // Set some default data if API fails
        setAnalytics({
          totalCustomers: 0,
          activeCustomers: 0,
          inactiveCustomers: 0,
          avgOrderValue: 0,
          newCustomersThisMonth: 0,
          customerGrowth: 0
        });
      }
    } catch (err) {
      console.error("Customer analytics fetch error:", err);
      // Set some default data if API fails
      setAnalytics({
        totalCustomers: 0,
        activeCustomers: 0,
        inactiveCustomers: 0,
        avgOrderValue: 0,
        newCustomersThisMonth: 0,
        customerGrowth: 0
      });
    }
  };

  useEffect(() => {
    fetchCustomersData();
    fetchCustomerAnalytics();
  }, [fetchCustomersData]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCustomersData();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, fetchCustomersData]);

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
    switch (status) {
      case "Active":
        return (
          <Badge variant="outline" className="border-green-400 text-green-700">
            Active
          </Badge>
        )
      case "Inactive":
        return (
          <Badge variant="outline" className="border-gray-400 text-gray-700">
            Inactive
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading && customers.length === 0) {
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
            onClick={() => fetchCustomersData()}
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
          <h2 className="text-3xl font-bold tracking-tight text-black">Customers</h2>
          <p className="text-gray-600">Manage your customer relationships</p>
        </div>
        <button
          onClick={() => fetchCustomersData()}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          Refresh Data
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{analytics?.totalCustomers?.toLocaleString() || 0}</div>
            {analytics?.customerGrowth !== undefined && formatPercentage(analytics.customerGrowth)}
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{analytics?.activeCustomers?.toLocaleString() || 0}</div>
            <p className="text-xs text-gray-600">
              {analytics?.totalCustomers > 0 
                ? `${Math.round((analytics.activeCustomers / analytics.totalCustomers) * 100)}% of total`
                : '0% of total'
              }
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Inactive Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{analytics?.inactiveCustomers?.toLocaleString() || 0}</div>
            <p className="text-xs text-gray-600">
              {analytics?.totalCustomers > 0 
                ? `${Math.round((analytics.inactiveCustomers / analytics.totalCustomers) * 100)}% of total`
                : '0% of total'
              }
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Avg. Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{formatCurrency(analytics?.avgOrderValue)}</div>
            <p className="text-xs text-gray-600">Per customer order</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Customer Directory</CardTitle>
          <CardDescription className="text-gray-600">
            View and manage customer information ({pagination.totalCustomers} total customers)
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm border-gray-300"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading && customers.length === 0 ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200">
                    <TableHead className="text-black">Customer</TableHead>
                    <TableHead className="text-black">Contact</TableHead>
                    <TableHead className="text-black">Orders</TableHead>
                    <TableHead className="text-black">Total Spent</TableHead>
                    <TableHead className="text-black">Status</TableHead>
                    <TableHead className="text-black">Join Date</TableHead>
                    <TableHead className="text-black">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer._id} className="border-gray-200">
                      <TableCell className="font-medium text-black">
                        <div className="flex items-center space-x-3">
                          {customer.avatar && (
                            <img 
                              src={customer.avatar} 
                              alt={customer.fullName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          )}
                          <span>{customer.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-3 w-3 mr-1" />
                            {customer.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-3 w-3 mr-1" />
                            {customer.phone || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{customer.totalOrders}</TableCell>
                      <TableCell className="text-black font-medium">{formatCurrency(customer.totalSpent)}</TableCell>
                      <TableCell>{getStatusBadge(customer.status)}</TableCell>
                      <TableCell className="text-gray-600">{formatDate(customer.createdAt)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-black">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between space-x-2 py-4">
                  <div className="text-sm text-gray-600">
                    Showing {((pagination.currentPage - 1) * 20) + 1} to {Math.min(pagination.currentPage * 20, pagination.totalCustomers)} of {pagination.totalCustomers} customers
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchCustomersData(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage || loading}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchCustomersData(pagination.currentPage + 1)}
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
    </div>
  )
}
