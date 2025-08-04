# MERN Ecommerce Project

A full-stack ecommerce application built with MongoDB, Express.js, React.js, and Node.js.

## Project Structure

- **BackEnd/** - Node.js/Express API server
- **Website/** - Customer-facing React frontend
- **FrontEnd/** - Admin dashboard React frontend

## Features

✅ **User Authentication** - Registration, login, logout with JWT tokens  
✅ **Protected Routes** - Both customer and admin panels  
✅ **Product Management** - Full CRUD operations for products  
✅ **Order Management** - Complete order processing system  
✅ **File Uploads** - Image uploads with Cloudinary integration  
✅ **Responsive Design** - Modern UI with Tailwind CSS  
✅ **Admin Dashboard** - Product, order, and user management  

## Quick Setup

### 1. Backend Setup

```bash
cd BackEnd
npm install
```

Create a `.env` file in the BackEnd directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/mern-ecommerce
DB_NAME=mern-ecommerce

# JWT Tokens (Generate your own secure random strings)
ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-here
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary (Sign up at cloudinary.com)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# CORS
CORS_ORIGIN=http://localhost:5173

# Server
PORT=5000
```

Start the backend server:
```bash
npm start
```

### 2. Website Frontend Setup (Customer)

```bash
cd Website
npm install
npm run dev
```

Access at: http://localhost:5173

### 3. Admin Frontend Setup

```bash
cd FrontEnd
npm install
npm run dev
```

Access at: http://localhost:5174

## API Endpoints

### Authentication
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `GET /api/v1/users/current-user` - Get current user

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get product by ID
- `POST /api/v1/products` - Create new product (with image upload)
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

### Orders
- `GET /api/v1/orders` - Get all orders
- `POST /api/v1/orders` - Create new order
- `GET /api/v1/orders/:id` - Get order by ID
- `PATCH /api/v1/orders/:id/status` - Update order status
- `DELETE /api/v1/orders/:id` - Delete order

## Database Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Ensure MongoDB is running on `mongodb://localhost:27017` or update the `MONGODB_URI` in your .env file

## Environment Variables

### Required Setup:

1. **JWT Secrets**: Generate secure random strings for `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`
2. **Cloudinary**: Sign up at [cloudinary.com](https://cloudinary.com) for image uploads
3. **MongoDB**: Set up MongoDB locally or use MongoDB Atlas

### Generate JWT Secrets:
```bash
# In Node.js console or terminal
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Technologies Used

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- Cloudinary (Image uploads)
- Multer (File handling)
- bcryptjs (Password hashing)

### Frontend
- React.js
- React Router DOM
- Axios (API calls)
- Tailwind CSS
- Shadcn/ui Components
- Redux Toolkit (State management)
- Material-UI Icons

## Project Architecture

### Authentication Flow
1. User registers/logs in
2. Backend generates JWT access & refresh tokens
3. Tokens stored in localStorage + httpOnly cookies
4. Protected routes verify JWT tokens
5. Automatic token refresh on expiry

### File Upload Flow
1. Frontend uploads files to `/uploads` endpoint
2. Multer processes files
3. Cloudinary stores images
4. Database stores Cloudinary URLs

## Development Notes

- Backend runs on port 5000
- Website (customer) runs on port 5173
- Admin dashboard runs on port 5174
- CORS configured for cross-origin requests
- All API responses follow consistent format with ApiResponse utility

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
