const mongoose = require('mongoose')

const membershipSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    ownersName: {
        type: String,
        required:[true, 'Full Name is required']
    },
    address: {
        type: String,
        required:[true, 'Address is required']
    },
    phone: {
        type: String,
        required:[true, 'Phone Number is required']
    },
    email: {
        type: String,
        required:[true, 'Email is required']
    },
    petsName: {
        type: String,
        required:[true, 'Name of Pet is required']
    },
    species: {
        type: String,
        required:[true, 'Species of Pet is required']
    },
    breed: {
        type: String,
        required:[true, 'Breed of Pet is required']
    },
    status: {
        type: String,
        default: 'pending'
    },
}, 
{ timestamps: true }
);

const membershipModel = mongoose.model('membership', membershipSchema)
module.exports = membershipModel