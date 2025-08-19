import { CustomizeProduct } from "../models/customizeProduct.models.js";
import { Product } from "../models/products.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";

// Create a new customized product
const createCustomProduct = asyncHandler(async (req, res) => {
  const { baseShirtId, userId, customLogo, position, size, finalPrice, customizationName } = req.body;

  // Validate required fields
  if (!baseShirtId || !userId || !customLogo || !position || !size || !finalPrice) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if base shirt exists
  const baseShirt = await Product.findById(baseShirtId);
  if (!baseShirt) {
    throw new ApiError(404, "Base shirt not found");
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Create customized product
  const customProduct = await CustomizeProduct.create({
    baseShirtId,
    userId,
    customLogo,
    position,
    size,
    finalPrice,
    customizationName: customizationName || "Custom Design",
  });

  // Populate base shirt details
  await customProduct.populate("baseShirtId", "name price images category");

  return res.status(201).json(
    new ApiResponse(201, customProduct, "Custom product created successfully")
  );
});

// Get all customized products for a user
const getUserCustomProducts = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const customProducts = await CustomizeProduct.find({ 
    userId, 
    isActive: true 
  })
    .populate("baseShirtId", "name price images category description")
    .populate("userId", "fullName email")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, customProducts, "Custom products retrieved successfully")
  );
});

// Get a specific customized product by ID
const getCustomProductById = asyncHandler(async (req, res) => {
  const { customProductId } = req.params;

  const customProduct = await CustomizeProduct.findById(customProductId)
    .populate("baseShirtId", "name price images category description")
    .populate("userId", "fullName email");

  if (!customProduct) {
    throw new ApiError(404, "Custom product not found");
  }

  return res.status(200).json(
    new ApiResponse(200, customProduct, "Custom product retrieved successfully")
  );
});

// Update a customized product
const updateCustomProduct = asyncHandler(async (req, res) => {
  const { customProductId } = req.params;
  const { customLogo, position, size, finalPrice, customizationName } = req.body;

  const customProduct = await CustomizeProduct.findById(customProductId);
  if (!customProduct) {
    throw new ApiError(404, "Custom product not found");
  }

  // Update fields
  if (customLogo) customProduct.customLogo = customLogo;
  if (position) customProduct.position = position;
  if (size) customProduct.size = size;
  if (finalPrice) customProduct.finalPrice = finalPrice;
  if (customizationName) customProduct.customizationName = customizationName;

  await customProduct.save();
  await customProduct.populate("baseShirtId", "name price images category");

  return res.status(200).json(
    new ApiResponse(200, customProduct, "Custom product updated successfully")
  );
});

// Delete a customized product (soft delete)
const deleteCustomProduct = asyncHandler(async (req, res) => {
  const { customProductId } = req.params;

  const customProduct = await CustomizeProduct.findById(customProductId);
  if (!customProduct) {
    throw new ApiError(404, "Custom product not found");
  }

  customProduct.isActive = false;
  await customProduct.save();

  return res.status(200).json(
    new ApiResponse(200, {}, "Custom product deleted successfully")
  );
});

// Get all shirts suitable for customization
const getCustomizableShirts = asyncHandler(async (req, res) => {
  const { category = "shirts" } = req.query;

  // Temporarily show all shirts to debug the issue
  const shirts = await Product.find({ 
    category: new RegExp(category, "i")
    // Temporarily removed filters for debugging
    // isActive: true,
    // isCustomizable: true 
  }).select("name price images category description isCustomizable");

  console.log(`[DEBUG] Found ${shirts.length} shirts with category "${category}"`);
  shirts.forEach(shirt => {
    console.log(`[DEBUG] - ${shirt.name} (Category: ${shirt.category}, Customizable: ${shirt.isCustomizable})`);
  });

  return res.status(200).json(
    new ApiResponse(200, shirts, `Found ${shirts.length} shirts for customization`)
  );
});

export {
  createCustomProduct,
  getUserCustomProducts,
  getCustomProductById,
  updateCustomProduct,
  deleteCustomProduct,
  getCustomizableShirts,
};
