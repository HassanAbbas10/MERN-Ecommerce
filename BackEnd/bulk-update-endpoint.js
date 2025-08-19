// Add this endpoint to your product.controllers.js

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
