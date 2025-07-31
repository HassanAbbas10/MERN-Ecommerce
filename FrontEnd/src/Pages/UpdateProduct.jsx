"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Trash2, Upload, X } from "lucide-react";
import { axiosInstance } from "@/services/api/api";

export default function UpdateProduct() {
  const navigate = useNavigate();
  const { id: productId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    image: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/products/${productId}`);
        const productData = res.data.data;
        setProduct({
          name: productData.name || "",
          description: productData.description || "",
          price: productData.price || "",
          category: productData.category || "",
          quantity: productData.quantity || "",
          image: productData.image || "",
        });
        // Set the current image as preview
        setImagePreview(productData.image || "");
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif","image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please select a valid image file (JPG, PNG, GIF)");
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setError(null); // Clear any previous errors
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(product.image || ""); // Reset to original image if exists
    // Reset the file input
    const fileInput = document.getElementById("image");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let productData = { ...product };

      // If a new image file is selected, convert to base64
      if (imageFile) {
        try {
          const base64Image = await convertImageToBase64(imageFile);
          productData.image = base64Image;
          console.log("Image converted to base64");
        } catch (imageError) {
          console.error("Failed to process image:", imageError);
          setError("Failed to process image. Please try again.");
          setIsLoading(false);
          return;
        }
      }

      const res = await axiosInstance.put(`/products/${productId}`, productData);
      console.log("Product updated successfully:", res.data);
      navigate("/products");
    } catch (error) {
      console.error("Failed to update product:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      setIsLoading(true);
      try {
        await axiosInstance.delete(`/products/${productId}`);
        console.log("Product deleted successfully");
        navigate("/products");
      } catch (error) {
        console.error("Failed to delete product:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (loading) {
    return <div className="flex-1 p-8">Loading product...</div>;
  }

  if (error) {
    return <div className="flex-1 p-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/products">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-black"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-black">
              Update Product
            </h2>
            <p className="text-gray-600">
              Modify product details and information
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isLoading}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Product
        </Button>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Product Information</CardTitle>
            <CardDescription className="text-gray-600">
              Update the details of your product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-black">
                  Product Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  value={product.name}
                  onChange={handleInputChange}
                  className="border-gray-300"
                  placeholder="Enter product name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-black">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  value={product.description}
                  onChange={handleInputChange}
                  className="border-gray-300 min-h-[120px]"
                  placeholder="Enter product description"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-black">
                    Price (PKR) *
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    value={product.price}
                    onChange={handleInputChange}
                    className="border-gray-300"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-black">
                    Quantity *
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    required
                    value={product.quantity}
                    onChange={handleInputChange}
                    className="border-gray-300"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-black">
                  Category *
                </Label>
                <Select
                  value={product.category}
                  onValueChange={(value) =>
                    setProduct((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shirts">Shirts</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="beauty">Beauty</SelectItem>
                    <SelectItem value="toys">Toys</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-black">
                  Product Image
                </Label>
                <div className="space-y-4">
                  {imagePreview && (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-32 h-32 object-cover border border-gray-300 rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={removeImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="border-gray-300 hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("image").click()}
                      className="border-gray-300"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {imageFile ? "Change Image" : "Choose Image"}
                    </Button>
                    {imageFile && (
                      <span className="text-sm text-gray-600">
                        {imageFile.name}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Supported formats: JPG, PNG, GIF. Max size: 5MB
                  </p>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Updating Product...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Product
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => navigate("/products")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}