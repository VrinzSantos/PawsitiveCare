const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    doctorId: {
        type: String,
        required: true,
    },
    doctorInfo: {
        type: Object,
        required: true,
    },
    userInfo: {
        type: Object,
        required: true,
    },
    serviceType: {
        type: [String],
        enum: ['Medication', 'Vaccination', 'Checkup', 'Surgery', 'Lab test', 'Deworming'],
        required: true,
    },
    description: {
        type: String,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
    },
    reason: {
        type: String,
        default: '',
    },
}, { timestamps: true })

const appointmentModel = mongoose.model('appointments', appointmentSchema)

module.exports = appointmentModel;