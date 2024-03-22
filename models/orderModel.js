const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Inventory', 
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    orderDate: {
        type: Date,
        required: true,
    },
    customerName: {
        type: String,
        required: true, 
    },
    amountReceived: {
        type: Number,
        required: true,
    },
    change: {
        type: Number,
        required: true,
    },
    // You can add more fields such as order date, payment information, shipping details, etc.
}, { timestamps: true });

orderSchema.virtual('formattedOrderDate').get(function () {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return this.orderDate.toLocaleDateString(undefined, options);
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
