import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Edit, Trash2, Settings, Plus, Palette } from "lucide-react"
import { productAPI, customizeAPI } from "@/services/api/apiService"

export default function CustomizationManagement() {
  const [products, setProducts] = useState([])
  const [customProducts, setCustomProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [activeTab, setActiveTab] = useState("shirts") // shirts, custom-orders

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [productsRes, customRes] = await Promise.all([
        productAPI.getAllProducts(),
        customizeAPI.getCustomizableShirts()
      ])
      
      setProducts(productsRes.data || [])
      setCustomProducts(customRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleCustomizable = async (productId) => {
    try {
      // This would require a new API endpoint to update product customizable status
      // For now, we'll show a message
      alert(`Feature to toggle customizable status will be implemented. Product ID: ${productId}`)
      // TODO: Implement updateProduct API call
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Error updating product status')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || product.category === filterCategory
    const isShirt = product.category === "shirts" || product.category === "clothing"
    return matchesSearch && matchesCategory && isShirt
  })

  const customizableShirts = filteredProducts.filter(product => product.isCustomizable)
  const nonCustomizableShirts = filteredProducts.filter(product => !product.isCustomizable)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customization data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customization Management</h1>
          <p className="text-gray-600 mt-1">Manage shirts available for customization and view custom orders</p>
        </div>
        <Button onClick={() => window.location.href = '/add-product'} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Shirt
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Shirts</p>
                <p className="text-2xl font-bold text-gray-900">{filteredProducts.length}</p>
              </div>
              <Settings className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customizable</p>
                <p className="text-2xl font-bold text-green-600">{customizableShirts.length}</p>
              </div>
              <Palette className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Standard Only</p>
                <p className="text-2xl font-bold text-gray-600">{nonCustomizableShirts.length}</p>
              </div>
              <Settings className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Custom Orders</p>
                <p className="text-2xl font-bold text-purple-600">{customProducts.length}</p>
              </div>
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("shirts")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "shirts"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Shirt Management
          </button>
          <button
            onClick={() => setActiveTab("custom-orders")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "custom-orders"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Custom Orders
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search shirts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="shirts">Shirts</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content based on active tab */}
      {activeTab === "shirts" ? (
        <Card>
          <CardHeader>
            <CardTitle>Shirt Inventory</CardTitle>
            <CardDescription>
              Manage which shirts are available for customization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Customizable</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.images?.[0] || "/placeholder.jpg"}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">ID: {product._id.slice(-6)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">${product.price}</TableCell>
                    <TableCell>
                      <Badge variant={product.quantity > 0 ? "default" : "destructive"}>
                        {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={product.isCustomizable || false}
                          onChange={() => toggleCustomizable(product._id)}
                          className="rounded border-gray-300"
                        />
                        <Badge variant={product.isCustomizable ? "default" : "secondary"}>
                          {product.isCustomizable ? "Customizable" : "Standard"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Custom Orders</CardTitle>
            <CardDescription>
              View and manage customer customization orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Custom Orders Feature</h3>
              <p className="text-gray-500 mb-4">
                This section will show all customer customization orders with their designs.
              </p>
              <p className="text-sm text-gray-400">
                Integration with order management system coming soon...
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
