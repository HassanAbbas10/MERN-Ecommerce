import { Product } from "../models/products.models";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock"
      });
    }

    res.json({
      success: true,
      message: "Item can be added to cart",
      data: {
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          images: product.images,
          quantity: product.quantity
        },
        requestedQuantity: quantity
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const getCart = async (req, res) => {
  try {
    res.json({
      success: true,
      data: { items: [] },
      message: "Cart management should be handled on frontend without user system"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock"
      });
    }

    res.json({
      success: true,
      message: "Cart item can be updated",
      data: { productId, quantity }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    res.json({
      success: true,
      message: "Item can be removed from cart",
      data: { productId }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Cart can be cleared"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};