const appointmentModel = require('../models/appointmentModel');
const userModel = require('../models/userModels')
const getDoctorInfoController = async(req, res) => {

    try {
        const doctor = await userModel.findOne({userId: req.body.userId})
        res.status(200).send({
            success: true,
            message: 'Doctor Data Fetch Success',
            data: doctor,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Fetching Doctor Details',
        });
    }
}

const updateProfileController = async (req, res) => {
    try {
        const doctor = await userModel.findOneAndUpdate({userId:req.body.userId}, req.body)
        res.status(201).send({
            success: true,
            message: 'Doctor Profile Updated',
            data: doctor,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Doctor Profile Update Issue',
            error,
        })
    }
}

//Get Single Doctor Info
const getDoctorByIdController = async (req, res) => {
    try {
        const doctor = await userModel.findOne({userId:req.body.doctorId})
        res.status(200).send({
            success: true,
            message: "Data Successfully Fetched",
            data: doctor,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Fetching the Data',
        })
    }
}

const doctorAppointmentsController = async (req, res) => {
    try {
        const doctor = await userModel.findOne({userId:req.body.userId})
        const appointments = await appointmentModel.find({doctorId: doctor._id})
        res.status(200).send({
            success: true,
            message: "Doctor Appointments Fetched Successfully",
            data: appointments,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Fetching Doctor Appointments',
        })
    }
}


module.exports = { getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppointmentsController, }