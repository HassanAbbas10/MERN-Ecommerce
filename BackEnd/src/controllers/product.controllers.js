import {Product} from "../models/products.models.js";
import ApiResponse from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
export const getAllProducts = async (req, res) => {
  try {
    const product = await Product.find();
    res.status(201).json(new ApiResponse(200,product,"Got all the Products successfully"));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(201).json(new ApiResponse(200,product,"Get Product by Id successfully"));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product is not in the database" });
    }

    res.status(201).json(new ApiResponse(200,updatedProduct,"Product uploaded successfully"));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product is not in the database" });
    }
    res.status(201).json(new ApiResponse(200,"Product dxeleted Successfully 🎃"));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Bulk update shirts to be customizable
export const makeAllShirtsCustomizable = async (req, res) => {
  try {
    // Update all shirts to be customizable
    const result = await Product.updateMany(
      { category: 'shirts' },
      { $set: { isCustomizable: true } }
    );

    // Get updated shirts
    const customizableShirts = await Product.find({ 
      category: 'shirts', 
      isCustomizable: true 
    }).select('name price category isCustomizable');

    res.status(200).json(new ApiResponse(200, {
      modifiedCount: result.modifiedCount,
      customizableShirts
    }, `Updated ${result.modifiedCount} shirts to be customizable`));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addProducts = async (req, res) => {
  try {

    const localFilePaths = req.files;

    if (!localFilePaths || localFilePaths.length === 0) {
      return res.status(400).json({ message: "At least one image file is required" });
    }


    const uploadPromises = localFilePaths.map(file => uploadOnCloudinary(file.path));
    const uploadResults = await Promise.all(uploadPromises);

    const imageUrls = uploadResults
      .filter(result => result?.secure_url)
      .map(result => result.secure_url);

    if (imageUrls.length === 0) {
      return res.status(500).json({ message: "All Cloudinary uploads failed" });
    }

    if (imageUrls.length !== localFilePaths.length) {
      console.warn(`Some image uploads failed. Expected: ${localFilePaths.length}, Successful: ${imageUrls.length}`);
    }

    const {
      name,
      description,
      rating,
      price,
      quantity,
      category,
      isCustomizable,
    } = req.body;

    const product = await Product.create({
      name,
      images: imageUrls, 
      description,
      rating,
      price,
      quantity,
      category,
      isCustomizable: isCustomizable === 'true' || isCustomizable === true,
    });

    res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};