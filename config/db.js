const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Database Connected'.bgGreen.white);
    } catch (error) {
        console.log(`Database not connected, Error: ${error}`.bgRed.white);
    }
};

module.exports = connectDB;