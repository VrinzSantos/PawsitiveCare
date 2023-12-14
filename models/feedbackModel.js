const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    feedback: {
        type: String,
        required: true,
    },
    ratings: {
        type: String,
        required: true,
    },
});

const feedbackModel = mongoose.model("feedback", feedbackSchema);

module.exports = feedbackModel;