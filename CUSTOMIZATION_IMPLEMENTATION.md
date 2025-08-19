# Customization Feature Implementation

This document outlines all the files created and modified for the Custom Shirt Designer feature.

## 📁 File Structure & Locations

### Backend Files

1. **Model**: `BackEnd/src/models/customizeProduct.models.js`
   - Mongoose schema for storing customized products
   - Fields: baseShirtId, userId, customLogo, position, size, finalPrice, customizationName

2. **Controller**: `BackEnd/src/controllers/customize.controllers.js`
   - Handles all API logic for customization
   - Functions: createCustomProduct, getUserCustomProducts, getCustomProductById, updateCustomProduct, deleteCustomProduct, getCustomizableShirts

3. **Routes**: `BackEnd/src/routes/customize.routes.js`
   - Express routes for customization endpoints
   - Routes: POST /api/v1/customize, GET /api/v1/customize/user/:userId, etc.

4. **App Update**: `BackEnd/src/app.js`
   - Added customization routes to main app

### Frontend Files

5. **API Service**: `Website/src/services/api/apiService.js`
   - Added customizeAPI object with all API calls
   - Functions: createCustomProduct, getUserCustomProducts, getCustomizableShirts, etc.

6. **Customization Page**: `Website/src/Pages/Customization.jsx`
   - Main customization interface with Konva canvas
   - Features: shirt selection, logo upload, drag/resize, save to cart

7. **App Routes**: `Website/src/App.jsx`
   - Added /customization route with lazy loading

8. **Header Navigation**: `Website/src/components/Header/Header.jsx`
   - Added "Customize" navigation link (desktop & mobile)

9. **Cart Updates**: `Website/src/Pages/Cart.jsx`
   - Enhanced to display custom products with logo overlays
   - Shows custom design previews and labels

## 🚀 API Endpoints

### Backend Routes (with `/api/v1` prefix):

- `POST /customize` - Create new custom product
- `GET /customize/user/:userId` - Get user's custom products
- `GET /customize/:customProductId` - Get specific custom product
- `PUT /customize/:customProductId` - Update custom product
- `DELETE /customize/:customProductId` - Delete custom product
- `GET /customize/shirts` - Get available shirts for customization

## 🎨 Frontend Features

### Customization Page (`/customization`):
- **Shirt Selection**: Dropdown to choose base shirt
- **Logo Upload**: File input for image upload (converts to base64)
- **Canvas Editor**: 
  - Drag and drop logo positioning
  - Resize handles for logo scaling
  - Click to select/deselect logo
- **Design Controls**:
  - Custom name input
  - Price calculation (base + $10 fee)
  - Reset, Save, Download, Add to Cart buttons
- **Real-time Preview**: Live preview of shirt + logo

### Cart Enhancements:
- **Custom Product Display**: Shows "Custom" badge
- **Logo Overlay**: Displays logo positioned on shirt thumbnail
- **Custom Name**: Shows customization name
- **Visual Indicators**: Purple accents for custom items

## 🔧 Required Dependencies

### Backend:
- mongoose (already installed)
- express (already installed)

### Frontend:
- konva (for canvas manipulation)
- react-konva (React wrapper for Konva)

Install with: `pnpm add konva react-konva`

## 💾 Database Schema

### CustomizeProduct Model:
```javascript
{
  baseShirtId: ObjectId (ref: Product),
  userId: ObjectId (ref: User),
  customLogo: String (base64 or URL),
  position: { x: Number, y: Number },
  size: { width: Number, height: Number },
  finalPrice: Number,
  customizationName: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 User Flow

1. **Browse**: User goes to `/customization`
2. **Select**: Choose a base shirt from dropdown
3. **Upload**: Upload logo image (PNG/JPG)
4. **Design**: Drag and resize logo on shirt canvas
5. **Customize**: Enter design name and see price
6. **Action**: Either:
   - Save design for later
   - Add directly to cart
   - Download design as PNG

## 🔐 Authentication

- Most endpoints require JWT authentication (`verifyJWT` middleware)
- Only `GET /customize/shirts` is public
- User must be logged in to save designs or add to cart

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop and mobile
- **Loading States**: Spinner while saving/loading
- **Error Handling**: User-friendly error messages
- **Visual Feedback**: Success alerts and validation
- **Professional Design**: Consistent with existing app theme

## 🧪 Testing Points

1. **Shirt Selection**: Ensure shirts load from Product model
2. **Logo Upload**: Test various image formats and sizes
3. **Canvas Interaction**: Verify drag, resize, select/deselect
4. **Save Functionality**: Test saving to database
5. **Cart Integration**: Verify custom products in cart display
6. **Authentication**: Test login requirements
7. **Price Calculation**: Verify base price + customization fee

## 🚀 Deployment Notes

1. Ensure MongoDB connection for CustomizeProduct model
2. Set up proper file upload limits for logo images
3. Configure CORS for image handling
4. Test canvas performance on different devices
5. Optimize image processing for production

## 🔮 Future Enhancements

- Multiple logo support
- Text addition capability
- Color customization for shirts
- 3D preview
- Advanced positioning tools
- Template designs
- Social sharing of designs
- Bulk customization orders
