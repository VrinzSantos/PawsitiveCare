const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware');

const { 
    getAllUsersController, 
    getAllMembersController, 
    changeAccountStatusController, 
    getAllUserFeedbackController, 
    viewInventoryController, 
    addProductController,
    editProductController,
    deleteProductController,
    createOrderController,
    searchProductController,
    getAdminInfoController,
    updateProfileController,
    changePasswordController,
    viewOrderController,
    deleteOrderController,
    viewClientRecordsController,
    createClientRecordsController,
    editClientRecordsController,
    getClientRecordsByIdController,
    deleteClientRecordsController,
    viewRecordDetailsController,
    addHistoryController,
    addMedicationController,
    getProductByIdController,
    viewFullDetailsController,
} = require('../controllers/adminController');

const router = express.Router();

// Change Password
router.post('/change-password', authMiddleware, changePasswordController);

// POST Admin Info
router.post('/getAdminInfo', authMiddleware, getAdminInfoController);

// POST Update Admin Profile
router.post('/updateProfile', authMiddleware, updateProfileController);

//GET METHOD || USERS
router.get('/getAllUsers', authMiddleware, getAllUsersController);

//GET METHOD || MEMBERS
router.get('/getAllMembers', authMiddleware, getAllMembersController);

//POST ACCOUNT STATUS
router.post('/changeAccountStatus', authMiddleware, changeAccountStatusController);

//View Feedback
router.get('/user-feedbacks', authMiddleware, getAllUserFeedbackController);

//View Inventory
router.get('/inventory', authMiddleware, viewInventoryController);

//Search Product
router.get('/search-product', authMiddleware, searchProductController);

//Add Product
router.post('/add-product', authMiddleware, addProductController);

// Get Product
router.get('/get-product/:productId', authMiddleware, getProductByIdController);

//Edit Product
router.put('/edit-product/:productId', authMiddleware, editProductController);

//Delete Product
router.delete('/delete-product/:productId', authMiddleware, deleteProductController);

//Create Order
router.post('/create-order', authMiddleware, createOrderController);

//View Order
router.get('/view-order', authMiddleware, viewOrderController);

//Delete Order
router.delete('/delete-order/:orderId', authMiddleware, deleteOrderController);

//View Client Records
router.get('/view-client-records', authMiddleware, viewClientRecordsController);

//Create Client Records
router.post('/create-client-records', authMiddleware, createClientRecordsController);

//Create Client Records
router.put('/edit-client-records/:recordId', authMiddleware, editClientRecordsController);

// Get Client Records by recordId for editing
router.get('/get-client-records/:recordId', authMiddleware, getClientRecordsByIdController);

router.delete('/delete-client-records/:recordId', authMiddleware, deleteClientRecordsController);

//View Record Details
router.get('/view-record-details/:recordId', authMiddleware, viewRecordDetailsController);

router.post('/add-history/:recordId', authMiddleware, addHistoryController);

router.post('/add-medication/:recordId', authMiddleware, addMedicationController);

router.get('/view-full-details/:recordId', authMiddleware, viewFullDetailsController);

module.exports = router