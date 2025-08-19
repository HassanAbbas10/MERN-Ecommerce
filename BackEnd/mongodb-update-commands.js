// Simple MongoDB update command
// You can run this in MongoDB Compass or mongo shell

use Ecommerce

// Check current shirts
db.products.find({category: "shirts"}, {name: 1, category: 1, isCustomizable: 1})

// Update all shirts to be customizable
db.products.updateMany(
  {category: "shirts"},
  {$set: {isCustomizable: true}}
)

// Verify the update
db.products.find({category: "shirts", isCustomizable: true}, {name: 1, category: 1, isCustomizable: 1})
