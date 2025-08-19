import { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image, Transformer, Rect, Text } from 'react-konva';
import { useAuth } from '../context/AuthContext';
import { customizeAPI } from '../services/api/apiService';
import { productAPI } from '../services/api/apiService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectItem, SelectValue } from '@/components/ui/select';
import { Upload, Download, RotateCcw, Save, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/Redux/cartSlice';

const Customization = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // State management
  const [shirts, setShirts] = useState([]);
  const [selectedShirt, setSelectedShirt] = useState(null);
  const [uploadedLogo, setUploadedLogo] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const [shirtImage, setShirtImage] = useState(null);
  const [customizationName, setCustomizationName] = useState('');
  const [finalPrice, setFinalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shirtsLoading, setShirtsLoading] = useState(true);
  const [error, setError] = useState('');
  const [shirtImageLoading, setShirtImageLoading] = useState(false);
  
  // Canvas state
  const [logoPosition, setLogoPosition] = useState({ x: 100, y: 100 });
  const [logoSize, setLogoSize] = useState({ width: 100, height: 100 });
  const [isSelected, setIsSelected] = useState(false);
  const [shirtPosition, setShirtPosition] = useState({ x: 50, y: 50 });
  const [shirtSize, setShirtSize] = useState({ width: 400, height: 500 });
  const [isShirtSelected, setIsShirtSelected] = useState(false);
  
  // Refs
  const logoRef = useRef();
  const transformerRef = useRef();
  const stageRef = useRef();
  const shirtRef = useRef();
  const shirtTransformerRef = useRef();



  // Fetch available shirts on component mount
  useEffect(() => {
    fetchShirts();
  }, []);

  // Update transformer when logo is selected
  useEffect(() => {
    if (isSelected && logoRef.current && transformerRef.current) {
      transformerRef.current.nodes([logoRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Update transformer when shirt is selected
  useEffect(() => {
    if (isShirtSelected && shirtRef.current && shirtTransformerRef.current) {
      shirtTransformerRef.current.nodes([shirtRef.current]);
      shirtTransformerRef.current.getLayer().batchDraw();
    }
  }, [isShirtSelected]);

  // Calculate final price when shirt or customization changes
  useEffect(() => {
    if (selectedShirt) {
      const basePrice = selectedShirt.price || 0;
      const customizationFee = 10; // $10 customization fee
      setFinalPrice(basePrice + customizationFee);
    }
  }, [selectedShirt]);

  const fixAllShirts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.makeAllShirtsCustomizable();
      alert(`Success! Updated ${response.data.modifiedCount} shirts to be customizable.`);
      // Refresh the shirts list
      await fetchShirts();
    } catch (error) {
      console.error('Error fixing shirts:', error);
      alert('Failed to update shirts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchShirts = async () => {
    try {
      setShirtsLoading(true);
      setError('');
      const response = await customizeAPI.getCustomizableShirts();
      const shirtsData = response.data || [];
      setShirts(shirtsData);
      
      if (shirtsData.length === 0) {
        setError('No customizable shirts available at the moment. Please check back later or contact support.');
      }
    } catch (error) {
      console.error('Error fetching shirts:', error);
      setError('Failed to load customizable shirts. Please try again later.');
    } finally {
      setShirtsLoading(false);
    }
  };

  const handleShirtSelect = async (shirtId) => {
    const shirt = shirts.find(s => s._id === shirtId);
    
    setSelectedShirt(shirt);
    setShirtImage(null); // Reset shirt image
    setShirtImageLoading(true); // Show loading state
    
    if (shirt && shirt.images && shirt.images.length > 0) {
      // Strategy 1: Try to load the image with CORS
      const loadImageWithCORS = () => {
        return new Promise((resolve, reject) => {
          const img = new window.Image();
          img.crossOrigin = 'anonymous';
          
          img.onload = () => {
            resolve(img);
          };
          
          img.onerror = () => {
            reject(new Error('CORS failed'));
          };
          
          img.src = shirt.images[0];
        });
      };
      
      // Strategy 2: Try to load without CORS
      const loadImageWithoutCORS = () => {
        return new Promise((resolve, reject) => {
          const img = new window.Image();
          // No crossOrigin setting
          
          img.onload = () => {
            resolve(img);
          };
          
          img.onerror = () => {
            reject(new Error('Image loading failed'));
          };
          
          img.src = shirt.images[0];
        });
      };
      
      // Strategy 3: Create a proxy image using canvas
      const createProxyImage = async (originalUrl) => {
        // Fetch the image as blob
        const response = await fetch(originalUrl, { mode: 'cors' });
        if (!response.ok) throw new Error('Fetch failed');
        
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        
        return new Promise((resolve, reject) => {
          const img = new window.Image();
          img.onload = () => {
            URL.revokeObjectURL(objectUrl); // Clean up
            resolve(img);
          };
          img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Proxy image failed'));
          };
          img.src = objectUrl;
        });
      };
      
      // Strategy 4: Create fallback image
      const createFallbackImage = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');
        
        // Create a gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, 500);
        gradient.addColorStop(0, '#f8fafc');
        gradient.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 500);
        
        // Draw shirt outline
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#ffffff';
        
        // Shirt body
        ctx.fillRect(75, 100, 250, 350);
        ctx.strokeRect(75, 100, 250, 350);
        
        // Sleeves
        ctx.fillRect(25, 100, 75, 120);
        ctx.strokeRect(25, 100, 75, 120);
        ctx.fillRect(300, 100, 75, 120);
        ctx.strokeRect(300, 100, 75, 120);
        
        // Neck
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(200, 100, 30, 0, Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // Add shirt details
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(shirt.name, 200, 280);
        ctx.font = '16px Arial';
        ctx.fillText(`$${shirt.price}`, 200, 310);
        ctx.font = '14px Arial';
        ctx.fillText('(Image not available)', 200, 340);
        
        return new Promise((resolve) => {
          const fallbackImg = new window.Image();
          fallbackImg.onload = () => {
            resolve(fallbackImg);
          };
          fallbackImg.src = canvas.toDataURL();
        });
      };
      
      // Try loading strategies in order
      try {
        // Try CORS first
        const img = await loadImageWithCORS();
        setShirtImage(img);
      } catch (corsError) {
        try {
          // Try without CORS
          const img = await loadImageWithoutCORS();
          setShirtImage(img);
        } catch (noCorsError) {
          try {
            // Try proxy method
            const img = await createProxyImage(shirt.images[0]);
            setShirtImage(img);
          } catch (proxyError) {
            // Use fallback
            const fallbackImg = await createFallbackImage();
            setShirtImage(fallbackImg);
          }
        }
      }
    } else {
      // Create fallback image even when no images
      const createFallbackImage = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');
        
        // Create a gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, 500);
        gradient.addColorStop(0, '#f8fafc');
        gradient.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 500);
        
        // Draw shirt outline
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#ffffff';
        
        // Shirt body
        ctx.fillRect(75, 100, 250, 350);
        ctx.strokeRect(75, 100, 250, 350);
        
        // Sleeves
        ctx.fillRect(25, 100, 75, 120);
        ctx.strokeRect(25, 100, 75, 120);
        ctx.fillRect(300, 100, 75, 120);
        ctx.strokeRect(300, 100, 75, 120);
        
        // Neck
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(200, 100, 30, 0, Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // Add shirt details
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(shirt?.name || 'Unknown Shirt', 200, 280);
        ctx.font = '16px Arial';
        ctx.fillText(`$${shirt?.price || 0}`, 200, 310);
        ctx.font = '14px Arial';
        ctx.fillText('(No image available)', 200, 340);
        
        return new Promise((resolve) => {
          const fallbackImg = new window.Image();
          fallbackImg.onload = () => {
            resolve(fallbackImg);
          };
          fallbackImg.src = canvas.toDataURL();
        });
      };
      
      const fallbackImg = await createFallbackImage();
      setShirtImage(fallbackImg);
    }
    setShirtImageLoading(false); // Hide loading state
  };







  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setUploadedLogo(base64);
      
      // Create image object for canvas
      const img = new window.Image();
      
      img.onload = () => {
        setLogoImage(img);
        setLogoPosition({ x: 200, y: 200 }); // More centered position
        setLogoSize({ width: 100, height: 100 }); // Default size
      };
      
      img.onerror = (error) => {
        console.error('❌ Failed to load logo image:', error);
        
        // Alternative approach - create a simple colored rectangle as fallback
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ff6600';
        ctx.fillRect(0, 0, 100, 100);
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('LOGO', 50, 55);
        
        const fallbackImg = new window.Image();
        fallbackImg.onload = () => {
          setLogoImage(fallbackImg);
          setLogoPosition({ x: 200, y: 200 });
          setLogoSize({ width: 100, height: 100 });
        };
        fallbackImg.src = canvas.toDataURL();
      };
      
      // Set source AFTER setting up event handlers
      img.src = base64;
    };
    
    reader.onerror = (error) => {
      console.error('❌ Failed to read file:', error);
      alert('Failed to read the file. Please try again.');
    };
    
    reader.readAsDataURL(file);
  };

  const handleLogoDragEnd = (e) => {
    setLogoPosition({
      x: e.target.x(),
      y: e.target.y()
    });
  };

  const handleLogoTransform = () => {
    if (logoRef.current) {
      const node = logoRef.current;
      setLogoSize({
        width: node.width() * node.scaleX(),
        height: node.height() * node.scaleY()
      });
      setLogoPosition({
        x: node.x(),
        y: node.y()
      });
      
      // Reset scale after applying to width/height
      node.scaleX(1);
      node.scaleY(1);
    }
  };

  const handleShirtDragEnd = (e) => {
    setShirtPosition({
      x: e.target.x(),
      y: e.target.y()
    });
  };

  const handleShirtTransform = () => {
    if (shirtRef.current) {
      const node = shirtRef.current;
      setShirtSize({
        width: node.width() * node.scaleX(),
        height: node.height() * node.scaleY()
      });
      setShirtPosition({
        x: node.x(),
        y: node.y()
      });
      
      // Reset scale after applying to width/height
      node.scaleX(1);
      node.scaleY(1);
    }
  };

  const handleCanvasClick = (e) => {
    // Deselect when clicking empty space
    if (e.target === e.target.getStage()) {
      setIsSelected(false);
      setIsShirtSelected(false);
      if (transformerRef.current) {
        transformerRef.current.nodes([]);
      }
      if (shirtTransformerRef.current) {
        shirtTransformerRef.current.nodes([]);
      }
    }
  };

  const resetCustomization = () => {
    setUploadedLogo(null);
    setLogoImage(null);
    setLogoPosition({ x: 100, y: 100 });
    setLogoSize({ width: 100, height: 100 });
    setIsSelected(false);
    setShirtPosition({ x: 50, y: 50 });
    setShirtSize({ width: 400, height: 500 });
    setIsShirtSelected(false);
    setCustomizationName('');
  };

  const saveCustomization = async () => {
    if (!isAuthenticated) {
      alert('Please log in to save your customization');
      navigate('/login');
      return;
    }

    if (!selectedShirt || !uploadedLogo) {
      alert('Please select a shirt and upload a logo');
      return;
    }

    if (!customizationName.trim()) {
      alert('Please enter a name for your customization');
      return;
    }

    setLoading(true);
    try {
      const customData = {
        baseShirtId: selectedShirt._id,
        userId: user._id,
        customLogo: uploadedLogo,
        position: logoPosition,
        size: logoSize,
        finalPrice,
        customizationName: customizationName.trim()
      };

      await customizeAPI.createCustomProduct(customData);
      alert('Customization saved successfully!');
    } catch (error) {
      console.error('Error saving customization:', error);
      alert('Failed to save customization. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addCustomToCart = async () => {
    if (!isAuthenticated) {
      alert('Please log in to add to cart');
      navigate('/login');
      return;
    }

    if (!selectedShirt || !uploadedLogo) {
      alert('Please select a shirt and upload a logo');
      return;
    }

    // Create a custom product object for the cart
    const customProduct = {
      _id: `custom_${Date.now()}`, // Temporary ID for cart
      name: customizationName || `Custom ${selectedShirt.name}`,
      price: finalPrice,
      images: [selectedShirt.images[0]], // Use shirt image
      category: 'custom',
      isCustom: true,
      customization: {
        baseShirtId: selectedShirt._id,
        customLogo: uploadedLogo,
        position: logoPosition,
        size: logoSize,
        customizationName
      }
    };

    dispatch(addToCart(customProduct));
    alert('Custom product added to cart!');
  };

  const downloadDesign = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL();
      const link = document.createElement('a');
      link.download = `${customizationName || 'custom-design'}.png`;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your Custom Shirt
          </h1>
          <p className="text-lg text-gray-600">
            Select a shirt, upload your logo, and create something unique!
          </p>
        </div>

        {/* Loading State */}
        {shirtsLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading customizable shirts...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !shirtsLoading && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6 text-center">
                <div className="text-red-600 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">No Customizable Shirts Available</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <div className="space-y-2">
                  <Button 
                    onClick={fetchShirts} 
                    variant="outline" 
                    className="border-red-300 text-red-700 hover:bg-red-100 w-full"
                  >
                    Try Again
                  </Button>
                  <Button 
                    onClick={fixAllShirts} 
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                    disabled={loading}
                  >
                    {loading ? 'Fixing...' : '🔧 Fix All Shirts (Make Customizable)'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        {!shirtsLoading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Shirt Selection & Controls */}
            <div className="space-y-6">
            {/* Shirt Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Base Shirt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="shirt-select">Choose a shirt</Label>
                    <Select id="shirt-select" onChange={(e) => handleShirtSelect(e.target.value)} defaultValue="">
                      <SelectValue placeholder="Choose a shirt" />
                      {shirts.map((shirt) => (
                        <SelectItem key={shirt._id} value={shirt._id}>
                          {shirt.name} - ${shirt.price}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  
                </div>
                  
                  {selectedShirt && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold">{selectedShirt.name}</h3>
                      <p className="text-sm text-gray-600">${selectedShirt.price}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        {selectedShirt.description}
                      </p>
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Logo Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Your Logo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="logo-upload">Choose Image File</Label>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="mt-1"
                    />
                  </div>
                  
                  {uploadedLogo && (
                    <div className="mt-4">
                      <img
                        src={uploadedLogo}
                        alt="Uploaded logo"
                        className="w-20 h-20 object-contain border rounded"
                      />
                      <p className="text-sm text-green-600 mt-2">
                        ✓ Logo uploaded successfully
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Customization Details */}
            <Card>
              <CardHeader>
                <CardTitle>Customization Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="custom-name">Design Name</Label>
                    <Input
                      id="custom-name"
                      value={customizationName}
                      onChange={(e) => setCustomizationName(e.target.value)}
                      placeholder="My Awesome Design"
                    />
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span>Base Shirt:</span>
                      <span>${selectedShirt?.price || 0}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span>Customization Fee:</span>
                      <span>$10</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between items-center font-bold">
                      <span>Total:</span>
                      <span>${finalPrice}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={resetCustomization}
                variant="outline"
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Design
              </Button>
              
              <Button 
                onClick={downloadDesign}
                variant="outline"
                className="w-full"
                disabled={!selectedShirt || !uploadedLogo}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Design
              </Button>
              
              <Button 
                onClick={saveCustomization}
                className="w-full"
                disabled={loading || !selectedShirt || !uploadedLogo}
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Design'}
              </Button>
              
              <Button 
                onClick={addCustomToCart}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!selectedShirt || !uploadedLogo}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Center Panel - Canvas */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Design Preview</CardTitle>
                <p className="text-sm text-gray-600">
                  Drag and resize your logo on the shirt. Click on empty space to deselect.
                </p>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                  {selectedShirt ? (
                    <>
                      <Stage
                        width={500}
                        height={600}
                        ref={stageRef}
                        onClick={handleCanvasClick}
                        onTap={handleCanvasClick}
                        style={{ border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}
                      >
                        <Layer>
                          {/* Shirt Image */}
                          {shirtImageLoading && (
                            <Rect
                              x={50}
                              y={50}
                              width={400}
                              height={500}
                              fill="#f3f4f6"
                              stroke="#d1d5db"
                            />
                          )}
                          {shirtImageLoading && (
                            <Text
                              x={250}
                              y={300}
                              text="Loading shirt image..."
                              fontSize={16}
                              fill="#6b7280"
                              align="center"
                              offsetX={75}
                            />
                          )}
                          {shirtImage && !shirtImageLoading && (
                            <Image
                              ref={shirtRef}
                              image={shirtImage}
                              width={shirtSize.width}
                              height={shirtSize.height}
                              x={shirtPosition.x}
                              y={shirtPosition.y}
                              draggable
                              onClick={() => {
                                setIsShirtSelected(true);
                                setIsSelected(false); // Deselect logo
                              }}
                              onTap={() => {
                                setIsShirtSelected(true);
                                setIsSelected(false); // Deselect logo
                              }}
                              onDragEnd={handleShirtDragEnd}
                              onTransformEnd={handleShirtTransform}
                            />
                          )}
                          
                          {/* Logo Image */}
                          {logoImage && (
                            <Image
                              ref={logoRef}
                              image={logoImage}
                              x={logoPosition.x}
                              y={logoPosition.y}
                              width={logoSize.width}
                              height={logoSize.height}
                              draggable
                              onClick={() => {
                                setIsSelected(true);
                                setIsShirtSelected(false); // Deselect shirt
                              }}
                              onTap={() => {
                                setIsSelected(true);
                                setIsShirtSelected(false); // Deselect shirt
                              }}
                              onDragEnd={handleLogoDragEnd}
                              onTransformEnd={handleLogoTransform}
                            />
                          )}
                          
                          {/* Transformer for logo resizing */}
                          {isSelected && (
                            <Transformer
                              ref={transformerRef}
                              boundBoxFunc={(oldBox, newBox) => {
                                // Limit resize
                                if (newBox.width < 20 || newBox.height < 20) {
                                  return oldBox;
                                }
                                return newBox;
                              }}
                            />
                          )}
                          
                          {/* Transformer for shirt resizing */}
                          {isShirtSelected && (
                            <Transformer
                              ref={shirtTransformerRef}
                              boundBoxFunc={(oldBox, newBox) => {
                                // Limit resize - shirts can be larger
                                if (newBox.width < 50 || newBox.height < 50) {
                                  return oldBox;
                                }
                                // Also limit maximum size to keep it reasonable
                                if (newBox.width > 600 || newBox.height > 700) {
                                  return oldBox;
                                }
                                return newBox;
                              }}
                            />
                          )}
                        </Layer>
                      </Stage>
                    </>
                  ) : (
                    <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
                      <div className="text-center">
                        <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Select a shirt to start customizing</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {uploadedLogo && selectedShirt && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Tips:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>Logo:</strong> Click and drag your logo to reposition it</li>
                      <li>• <strong>Logo:</strong> Click on the logo and use the handles to resize</li>
                      <li>• <strong>Shirt:</strong> Click on the shirt to select and resize it</li>
                      <li>• <strong>Shirt:</strong> Drag the shirt to reposition it on the canvas</li>
                      <li>• Click on empty space to deselect items</li>
                      <li>• Use the reset button to start over</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Customization;
