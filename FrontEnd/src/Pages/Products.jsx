"use client";

import { useState,useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2} from "lucide-react";
import { useEffect } from "react";
import { productAPI } from "@/services/api/apiService";
import { useLocation } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

const fetchProducts = useCallback(async () => {
  try {
    const res = await productAPI.getAllProducts();
    setProducts(res.data);
    console.log(res.data);
  } catch (error) {
    console.log(error.message, "Failed while fetching the products");
  }
}, []);

useEffect(() => {
  fetchProducts();
}, [location, fetchProducts]);

const deleteProduct = useCallback(
  async (id) => {
    if (confirm("Are you sure that you want to delete this product?")) {
      try {
        await productAPI.deleteProduct(id);
        console.log("Product has been successfully deleted");
        fetchProducts();
      } catch (error) {
        console.log("Error occurred while deleting the product", error.message);
      }
    }
  },
  [fetchProducts]
);


  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-black text-white">Active</Badge>;
      case "Low Stock":
        return (
          <Badge variant="outline" className="border-gray-400 text-gray-700">
            Low Stock
          </Badge>
        );
      case "Out of Stock":
        return (
          <Badge variant="outline" className="border-red-400 text-red-700">
            Out of Stock
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black">
            Products
          </h2>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <Link to="/add-product">
          <Button className="bg-black text-white hover:bg-gray-800">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Product Inventory</CardTitle>
          <CardDescription className="text-gray-600">
            View and manage all your products
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
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
                <TableHead className="text-black">Product</TableHead>
                <TableHead className="text-black">Category</TableHead>
                <TableHead className="text-black">Price</TableHead>
                <TableHead className="text-black">Stock</TableHead>
                <TableHead className="text-black">Status</TableHead>
                <TableHead className="text-black">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product._id} className="border-gray-200">
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          product.images[0] || "/placeholder.svg?height=40&width=40"
                        }
                        alt={product.name}
                        className="w-10 h-10 rounded-md border border-gray-200"
                      />
                      <span className="text-black">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {product.category}
                  </TableCell>
                  <TableCell className="text-black font-medium">
                    PKR {product.price}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {product.quantity}
                  </TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {/* <Button variant="ghost" size="sm" className="text-gray-600 hover:text-black">
                        <Eye className="h-4 w-4" />
                      </Button> */}
                      <Link to={`/update-product/${product._id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-black"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        onClick={()=>{deleteProduct(product._id)}}
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
