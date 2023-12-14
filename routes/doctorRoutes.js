const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppointmentsController, updateStatusController } = require('../controllers/doctorController')
const router = express.Router()

//POST Single Doctor Info
router.post('/getDoctorInfo', authMiddleware, getDoctorInfoController)

//POST UPDATE Profile
router.post('/updateProfile', authMiddleware, updateProfileController)

//POST GET SINGLE DOC INFO
router.post('/getDoctorById', authMiddleware, getDoctorByIdController)

//GET Appointments
router.get('/doctor-appointments', authMiddleware, doctorAppointmentsController)

router.post('/update-status', authMiddleware, updateStatusController)

module.exports = router