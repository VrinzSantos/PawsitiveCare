// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const analyticsController = require('../controllers/analyticsController');

// Sales Today
router.get('/sales-today', authMiddleware, analyticsController.getSalesToday);

// Number of Products
router.get('/number-of-products', analyticsController.getNumberOfProducts);

// Weekly Sales
router.get('/weekly-sales', authMiddleware, analyticsController.getWeeklySales);

// Fastest Selling Product by category
router.get('/fastest-selling-products', authMiddleware, analyticsController.getFastestSellingProducts);

// Category Distribution
router.get('/product-category-distribution', authMiddleware, analyticsController.getProductCategoryDistribution);

// Monthly Sales
router.get('/monthly-sales', authMiddleware, analyticsController.getMonthlySalesController);

// Number of Users
router.get('/user-count', authMiddleware, analyticsController.getUserCount);


module.exports = router;
