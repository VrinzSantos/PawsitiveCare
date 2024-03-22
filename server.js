const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const multer = require('multer');
const path = require('path');

// dotenv
dotenv.config();

// mongodb connection
connectDB();

// rest object
const app = express();

// middlewares
app.use(express.json());
app.use(morgan('dev'));

// Set up storage for uploaded files using Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // The destination folder where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original file name
    },
});

const upload = multer({ storage: storage });

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// routes
app.use('/api/v1/user', require('./routes/userRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));
app.use('/api/v1/doctor', require('./routes/doctorRoutes'));
app.use('/api/v1/analytics', require('./routes/analyticsRoutes'));

app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Server Running',
    });
});

// Add a route to handle image uploads
app.post('/api/v1/admin/upload-product-image', upload.single('productImage'), (req, res) => {
    // Handle image upload here and send back a response with the relative image path
    if (req.file) {
        const imagePath = req.file.path; // Use the relative path
        res.status(201).json({ success: true, imagePath });
    } else {
        res.status(400).json({ success: false, error: 'Image upload failed' });
    }
});

// port
const port = process.env.PORT || 8080;

// listen port
app.listen(port, () => {
    console.log(`Server Running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`.bgCyan.white);
});
