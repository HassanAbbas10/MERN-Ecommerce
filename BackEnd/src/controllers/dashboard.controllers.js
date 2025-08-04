import { Product } from "../models/products.models.js";
import { Order } from "../models/orders.models.js";
import { User } from "../models/user.models.js";

// Get comprehensive dashboard analytics
export const getDashboardAnalytics = async (req, res) => {
  try {
    // Get current date for calculations
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Total counts
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    // Revenue calculations
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const currentMonthRevenue = await Order.aggregate([
      { 
        $match: { 
          status: { $ne: 'cancelled' },
          createdAt: { $gte: currentMonth }
        } 
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const lastMonthRevenue = await Order.aggregate([
      { 
        $match: { 
          status: { $ne: 'cancelled' },
          createdAt: { $gte: lastMonth, $lt: currentMonth }
        } 
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Order statistics
    const currentMonthOrders = await Order.countDocuments({
      createdAt: { $gte: currentMonth }
    });

    const lastMonthOrders = await Order.countDocuments({
      createdAt: { $gte: lastMonth, $lt: currentMonth }
    });

    // User statistics
    const currentMonthUsers = await User.countDocuments({
      createdAt: { $gte: currentMonth }
    });

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: lastMonth, $lt: currentMonth }
    });

    // New products this week
    const newProductsThisWeek = await Product.countDocuments({
      createdAt: { $gte: lastWeek }
    });

    // Order status breakdown
    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Monthly sales data for charts (last 6 months)
    const monthlyData = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          createdAt: { 
            $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) 
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          sales: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Product category distribution
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderNumber totalAmount status createdAt items shippingAddress');

    // Calculate percentage changes
    const revenueChange = lastMonthRevenue[0]?.total > 0 
      ? ((currentMonthRevenue[0]?.total || 0) - lastMonthRevenue[0].total) / lastMonthRevenue[0].total * 100 
      : 0;

    const ordersChange = lastMonthOrders > 0 
      ? (currentMonthOrders - lastMonthOrders) / lastMonthOrders * 100 
      : 0;

    const usersChange = lastMonthUsers > 0 
      ? (currentMonthUsers - lastMonthUsers) / lastMonthUsers * 100 
      : 0;

    // Format monthly data for charts
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyData = monthlyData.map(item => ({
      month: monthNames[item._id.month - 1],
      sales: item.sales,
      orders: item.orders
    }));

    // Format category data for pie chart
    const formattedCategoryData = categoryStats.map((item, index) => {
      const colors = ['#000000', '#404040', '#808080', '#a0a0a0', '#c0c0c0'];
      return {
        name: item._id,
        value: item.count,
        color: colors[index % colors.length]
      };
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalRevenue: totalRevenue[0]?.total || 0,
          totalOrders,
          totalUsers,
          totalProducts,
          revenueChange: Math.round(revenueChange * 10) / 10,
          ordersChange: Math.round(ordersChange * 10) / 10,
          usersChange: Math.round(usersChange * 10) / 10,
          newProductsThisWeek
        },
        charts: {
          monthlyData: formattedMonthlyData,
          categoryData: formattedCategoryData,
          orderStatusStats
        },
        recentOrders
      }
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get detailed sales analytics
export const getSalesAnalytics = async (req, res) => {
  try {
    const { period = '7d' } = req.query; // 7d, 30d, 90d, 1y
    
    let dateFilter;
    const now = new Date();
    
    switch (period) {
      case '7d':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        dateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        dateFilter = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const salesData = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          createdAt: { $gte: dateFilter }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: period === '1y' ? '%Y-%m' : '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          sales: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    res.json({
      success: true,
      data: salesData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
