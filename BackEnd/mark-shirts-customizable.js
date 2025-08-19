// Quick script to mark all shirts as customizable
import mongoose from 'mongoose';
import { Product } from './src/models/products.models.js';
import { DB_name } from './src/constants.js';

const markShirtsCustomizable = async () => {
  try {
    console.log('🚀 Starting script...');
    console.log('Environment MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    console.log('DB_name:', DB_name);
    
    // Connect to database
    const connectionString = `${process.env.MONGODB_URI}/${DB_name}` || `mongodb://localhost:27017/${DB_name}`;
    console.log('Connection string:', connectionString.replace(/\/\/.*:.*@/, '//***:***@')); // Hide credentials
    
    await mongoose.connect(connectionString);
    console.log('📦 Connected to MongoDB');
    
    // First, check all products regardless of category
    const allProducts = await Product.find({});
    console.log(`📋 Found ${allProducts.length} total products in database`);
    
    // Check products by category
    const shirts = await Product.find({ category: 'shirts' });
    const electronics = await Product.find({ category: 'electronics' });
    const dairy = await Product.find({ category: 'dairy' });
    
    console.log(`📋 Products by category:`);
    console.log(`  - Shirts: ${shirts.length}`);
    console.log(`  - Electronics: ${electronics.length}`);
    console.log(`  - Dairy: ${dairy.length}`);
    
    // Show all products with their categories
    if (allProducts.length > 0) {
      console.log('\n📋 All products in database:');
      allProducts.forEach(product => {
        console.log(`  - ${product.name} (Category: "${product.category}", Customizable: ${product.isCustomizable})`);
      });
    }
    
    if (shirts.length === 0) {
      console.log('❌ No shirts found in database. Please check your product categories.');
      console.log('💡 Make sure your products have category exactly as "shirts" (lowercase)');
      process.exit(1);
    }
    
    // Update all products in "shirts" category to be customizable
    const result = await Product.updateMany(
      { category: 'shirts' },
      { $set: { isCustomizable: true } }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} shirts to be customizable`);
    
    // Show updated shirts
    const customizableShirts = await Product.find({ 
      category: 'shirts', 
      isCustomizable: true 
    }).select('name category isCustomizable');
    
    console.log('\n📋 Customizable shirts:');
    customizableShirts.forEach(shirt => {
      console.log(`  - ${shirt.name} (Category: ${shirt.category}, Customizable: ${shirt.isCustomizable})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error marking shirts as customizable:', error);
    process.exit(1);
  }
};

markShirtsCustomizable();
