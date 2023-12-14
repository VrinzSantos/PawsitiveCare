// controllers/analyticsController.js
const Order = require('../models/orderModel');
const Inventory = require('../models/inventoryModel');
const userModel = require('../models/userModels')
const moment = require('moment');

// Get sales today
const getSalesToday = async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const salesTodayData = await Order.aggregate([
        {
          $match: {
            orderDate: { $gte: today },
          },
        },
        {
          $group: {
            _id: null,
            salesToday: { $sum: '$totalAmount' },
          },
        },
      ]);
  
      res.send({ success: true, salesToday: salesTodayData[0]?.salesToday || 0 });
    } catch (error) {
      res.status(500).send({ success: false, error: error.message });
    }
  };

// Get number of products
const getNumberOfProducts = async (req, res) => {
  try {
    const numberOfProducts = await Inventory.countDocuments();

    res.send({ success: true, numberOfProducts });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};


// Weekly Sales Analytics
const getWeeklySales = async (req, res) => {
  try {
    const today = moment();
    const startOfCurrentWeek = today.clone().startOf('week');
    const endOfCurrentWeek = today.clone().endOf('week');

    const currentWeekComplete = today.isAfter(endOfCurrentWeek);

    const startOfNextWeek = today.clone().add(1, 'week').startOf('week');
    const endOfNextWeek = today.clone().add(1, 'week').endOf('week');

    const startDate = currentWeekComplete ? startOfNextWeek.toDate() : startOfCurrentWeek.toDate();
    const endDate = currentWeekComplete ? endOfNextWeek.toDate() : endOfCurrentWeek.toDate();

    const dateRange = {
      start: startDate.toLocaleDateString(),
      end: endDate.toLocaleDateString(),
    };

    const weeklySalesData = await Order.aggregate([
      {
        $match: {
          orderDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%m/%d/%Y', date: { $add: ['$orderDate', 24 * 60 * 60 * 1000] } },
          },
          totalSales: { $sum: '$totalAmount' },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.send({ success: true, dateRange, weeklySalesData });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};


  const getFastestSellingProducts = async (req, res) => {
    try {
      // Fetch products with stockOut and price information
      const products = await Inventory.find({}, 'productName stocksOut productPrice');
  
  
      // Calculate total sales for each product (stocksOut * productPrice)
      const fastestSellingProducts = products.map((product) => {
        const stocksOut = product.stocksOut || 0; // Default to 0 if stocksOut is undefined
        const productPrice = product.productPrice || 0; // Use correct field name
  
        return {
          productName: product.productName,
          stocksOut: stocksOut,
          totalSales: stocksOut * productPrice,
        };
      });
  
  
      // Sort products based on total sales in descending order
      fastestSellingProducts.sort((a, b) => b.totalSales - a.totalSales);
  
      // Limit the result to the top 5 fastest-selling products
      const topProducts = fastestSellingProducts.slice(0, 5);
  
      res.send({ success: true, fastestSellingProducts: topProducts });
    } catch (error) {
      res.status(500).send({ success: false, error: error.message });
    }
  };


const getProductCategoryDistribution = async (req, res) => {
    try {
      // Aggregate data to get product category distribution
      const categoryDistribution = await Inventory.aggregate([
        {
          $group: {
            _id: '$productCategory',
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);
  
      res.send({ success: true, categoryDistribution });
    } catch (error) {
      res.status(500).send({ success: false, error: error.message });
    }
  };

  const getMonthlySalesController = async (req, res) => {
    try {
      // Fetch orders with orderDate information
      const orders = await Order.find({}, 'totalAmount orderDate');
  
      // Organize orders by month
      const monthlySalesData = {};
  
      orders.forEach((order) => {
        const monthYear = order.orderDate.toISOString().slice(0, 7); // Get YYYY-MM (month-year)
        if (!monthlySalesData[monthYear]) {
          monthlySalesData[monthYear] = 0;
        }
        monthlySalesData[monthYear] += order.totalAmount;
      });
  
      // Convert monthlySalesData object to an array of objects
      const formattedMonthlySalesData = Object.entries(monthlySalesData).map(([monthYear, totalAmount]) => ({
        monthYear,
        totalAmount,
      }));
  
      // Sort the array by monthYear
      formattedMonthlySalesData.sort((a, b) => a.monthYear.localeCompare(b.monthYear));
  
      res.json({ success: true, monthlySalesData: formattedMonthlySalesData });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  const getUserCount = async (req, res) => {
    try {
      const userCount = await userModel.countDocuments();
      res.json({ success: true, userCount });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  

module.exports = {
  getSalesToday,
  getNumberOfProducts,
  getWeeklySales,
  getFastestSellingProducts,
  getProductCategoryDistribution,
  getMonthlySalesController,
  getUserCount,
};
