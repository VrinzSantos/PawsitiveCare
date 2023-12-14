const express = require('express');
const { 
    loginController, 
    registerController, 
    authController, 
    applyMembershipController,
    getAllNotificationController,
    deleteAllNotificationController, 
    getAllDoctorsController,
    bookAppointmentController,
    bookingAvailabilityController,
    userAppointmentController,
    editAppointmentController,
    deleteAppointmentController,
    createFeedbackController,
    userFeedbackController,
    changePasswordController,
    getUserInfoController,
    updateProfileController,
    forgotPasswordController,
    resetPasswordController
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

//router object
const router = express.Router();

//routes
//LOGIN || POST
router.post("/login", loginController);

//REGISTER || POST
router.post("/register", registerController);

router.post('/forgot-password', forgotPasswordController);

router.post('/reset-password/:id/:token', resetPasswordController);
// Change Password
router.post('/change-password', authMiddleware, changePasswordController);

// POST Admin Info
router.post('/getUserInfo', authMiddleware, getUserInfoController);

// POST Update Admin Profile
router.post('/updateProfile', authMiddleware, updateProfileController);

//Auth || POST
router.post('/getUserData', authMiddleware, authController);

//Apply Membership || POST
router.post('/apply-membership', authMiddleware, applyMembershipController);

//Notification || POST
router.post('/get-all-notification', authMiddleware, getAllNotificationController);

//Delete Notification || POST
router.post('/delete-all-notification', authMiddleware, deleteAllNotificationController);

//Get all Doctor
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);

//BOOK Appointment
router.post('/book-appointment', authMiddleware, bookAppointmentController);

//Booking Availability
router.post('/booking-availability', authMiddleware, bookingAvailabilityController);

//Appointment List
router.get('/user-appointments', authMiddleware, userAppointmentController);

// Edit Appointment
router.put('/edit-appointment/:appointmentId', authMiddleware, editAppointmentController);

// Delete Appointment
router.delete('/delete-appointment/:appointmentId', authMiddleware, deleteAppointmentController);

//Create Feedback
router.post('/create-feedback', authMiddleware, createFeedbackController);

//View Feedback
router.get('/feedbacks', authMiddleware, userFeedbackController);



module.exports = router;
