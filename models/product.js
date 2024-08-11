const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    productName: {
        type: String,
        trim: true,
        required: true,
    },
    productPrice: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
        required: true,
    },
    images: [
        {
            type: String,
            required: true,
        }
    ],
    popular: {
        type: Boolean,
        default: true, // ko bat buoc
    },
    recommend: {
        type: Boolean,
        default: false,
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;