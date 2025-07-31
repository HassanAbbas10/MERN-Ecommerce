import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, X, Save, Star } from "lucide-react"
import { axiosInstance } from "@/services/api/api"
import { useNavigate } from "react-router-dom"

export default function AddProduct() {
  const [isLoading, setIsLoading] = useState(false)
  const [imageFiles, setimageFiles] = useState([])
  const [imagePreview, setImagePreview] = useState([])
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    rating: "",
  })

  const navigate = useNavigate();

 const handleImageUpload = (e) => {
  const files = Array.from(e.target.files);

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; 
  const maxFiles = 5;

  if (files.length + imageFiles.length > maxFiles) {
    alert('You can upload a maximum of 5 images.');
    return;
  }

  const validFiles = [];
  const previews = [];

  for (const file of files) {
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, JPG, PNG, GIF, WEBP allowed.');
      return;
    }

    if (file.size > maxSize) {
      alert('One or more images exceed the 5MB limit.');
      return;
    }

    validFiles.push(file);
    previews.push(URL.createObjectURL(file));
  }

  setimageFiles((prev) => [...prev, ...validFiles]);
  setImagePreview((prev) => [...prev, ...previews]);
};


 const removeImage = (index) => {
  const updatedFiles = [...imageFiles];
  const updatedPreviews = [...imagePreview];

  URL.revokeObjectURL(updatedPreviews[index]);
  updatedFiles.splice(index, 1);
  updatedPreviews.splice(index, 1);

  setimageFiles(updatedFiles);
  setImagePreview(updatedPreviews);
};


  const validateForm = () => {
   if (imageFiles.length === 0) {
  alert("Please select at least one image.");
  return false;
}
if (imageFiles.length > 5) {
  alert("You can upload up to 5 images only.");
  return false;
}

    if (!product.name.trim()) {
      alert("Product name is required")
      return false
    }

    if (!product.description.trim()) {
      alert("Product description is required")
      return false
    }

    if (!product.price || parseFloat(product.price) <= 0) {
      alert("Please enter a valid price")
      return false
    }

    if (!product.quantity || parseInt(product.quantity) <= 0) {
      alert("Please enter a valid quantity")
      return false
    }

    if (!product.rating || parseFloat(product.rating) < 1 || parseFloat(product.rating) > 5) {
      alert("Please enter a valid rating between 1 and 5")
      return false
    }

    if (!product.category) {
      alert("Please select a category")
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
        imageFiles.forEach((file) => {
      formData.append('images', file);
    });
      formData.append('name', product.name.trim())
      formData.append('description', product.description.trim())
      formData.append('price', product.price)
      formData.append('category', product.category)
      formData.append('quantity', product.quantity)
      formData.append('rating', product.rating)

   const response = await axiosInstance.post('/products/add-product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

      console.log('Product created successfully:', response.data)
      alert('Product created successfully!')
      navigate('/products')
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
      setProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        quantity: "",
        rating: "",
      })
      setimageFiles([])
      setImagePreview("")
      
    } catch (error) {
      console.error('Error creating product:', error)
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Server error occurred'
        alert(`Error: ${errorMessage}`)
      } else if (error.request) {
        alert('Error: No response from server. Please check your internet connection.')
      } else {
        alert(`Error: ${error.message}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoBack = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
     navigate('/products')
    alert('Go back to products page')
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-600 hover:text-black"
          onClick={handleGoBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black">Add New Product</h2>
          <p className="text-gray-600">Create a new product for your store</p>
        </div>
      </div>

      <div onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Product Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Product Information</CardTitle>
                <CardDescription className="text-gray-600">Enter the basic details about your product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-black">
                    Product Name *
                  </Label>
                  <Input
                    id="name"
                    required
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
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
                    required
                    value={product.description}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    className="border-gray-300 min-h-[120px]"
                    placeholder="Describe your product in detail..."
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-black">
                      Price (PKR) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={product.price}
                      onChange={(e) => setProduct({ ...product, price: e.target.value })}
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
                      type="number"
                      min="0"
                      required
                      value={product.quantity}
                      onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
                      className="border-gray-300"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating" className="text-black">
                      Rating (1-5) *
                    </Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      required
                      value={product.rating}
                      onChange={(e) => setProduct({ ...product, rating: e.target.value })}
                      className="border-gray-300"
                      placeholder="4.5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Image */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Product Image</CardTitle>
                <CardDescription className="text-gray-600">
                  Upload an image to showcase your product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-4">
                {imagePreview.map((preview, index) => (
  <div key={index} className="relative group">
    <img
      src={preview}
      alt={`Preview ${index + 1}`}
      className="w-full h-32 object-cover rounded-lg border border-gray-200"
    />
    <Button
      type="button"
      variant="destructive"
      size="sm"
      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={() => removeImage(index)}
    >
      <X className="h-3 w-3" />
    </Button>
  </div>
))}


                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-6 h-6 mb-2 text-gray-400" />
                      <p className="text-xs text-gray-500">
                        {imageFiles ? 'Change Image' : 'Upload Image'}
                      </p>
                    </div>
                  <input 
  type="file" 
  accept="image/*" 
  multiple
  className="hidden" 
  onChange={handleImageUpload} 
/>

                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  Upload a single image for your product. Max size: 5MB. Supported formats: JPEG, JPG, PNG, GIF.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-black">
                    Category *
                  </Label>
                  <Select onValueChange={(value) => setProduct({ ...product, category: value })}>
                    <SelectTrigger className="border-gray-300 bg-black text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-black text-white">
                      <SelectItem value="shirts">Shirts</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="dairy">Dairy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Product Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {imagePreview && (
                  <div className="w-full h-24 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={imagePreview[0]}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {product.name && (
                  <div>
                    <p className="text-sm font-medium text-black">{product.name}</p>
                  </div>
                )}
                {product.price && (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-green-600">PKR{product.price}</span>
                  </div>
                )}
                {product.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                )}
                {product.category && (
                  <div>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full capitalize">
                      {product.category}
                    </span>
                  </div>
                )}
                {product.quantity && (
                  <div>
                    <span className="text-xs text-gray-600">Qty: {product.quantity}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleSubmit}
                  disabled={isLoading} 
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creating Product...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Product
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                  onClick={handleGoBack}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}