// Simple test script
import mongoose from 'mongoose';

const test = async () => {
  try {
    console.log('Testing database connection...');
    
    // Try with localhost first
    await mongoose.connect('mongodb://localhost:27017/Ecommerce');
    console.log('✅ Connected to MongoDB');
    
    // Test the Product model
    const Product = mongoose.model('Product', new mongoose.Schema({
      name: String,
      category: String,
      isCustomizable: { type: Boolean, default: false }
    }, { collection: 'products' }));
    
    const allProducts = await Product.find({});
    console.log(`Found ${allProducts.length} products`);
    
    allProducts.forEach(product => {
      console.log(`- ${product.name} (Category: "${product.category}")`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

test();
