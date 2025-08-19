// Script to update existing shirts to be customizable
import mongoose from 'mongoose';
import { Product } from './src/models/products.models.js';

const updateShirtsToCustomizable = async () => {
  try {
    console.log('🔄 Connecting to database...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/Ecommerce');
    console.log('✅ Connected to MongoDB');
    
    // Find all shirts
    const allShirts = await Product.find({ category: 'shirts' });
    console.log(`📋 Found ${allShirts.length} shirts in database`);
    
    if (allShirts.length === 0) {
      console.log('❌ No shirts found. Please add some shirts first.');
      process.exit(1);
    }
    
    // Show current status
    console.log('\n📊 Current shirt status:');
    allShirts.forEach(shirt => {
      console.log(`  - ${shirt.name}: isCustomizable = ${shirt.isCustomizable || false}`);
    });
    
    // Update all shirts to be customizable
    console.log('\n🔄 Updating shirts to be customizable...');
    const result = await Product.updateMany(
      { category: 'shirts' },
      { $set: { isCustomizable: true } }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} shirts to be customizable`);
    
    // Verify the update
    const updatedShirts = await Product.find({ 
      category: 'shirts',
      isCustomizable: true 
    });
    
    console.log('\n📋 Updated customizable shirts:');
    updatedShirts.forEach(shirt => {
      console.log(`  ✓ ${shirt.name} - $${shirt.price} (ID: ${shirt._id})`);
    });
    
    console.log(`\n🎉 Success! ${updatedShirts.length} shirts are now available for customization`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

updateShirtsToCustomizable();
