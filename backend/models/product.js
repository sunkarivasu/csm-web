const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    price: {
        type: Number,
        unique: false,
        required: [true, 'Product price is required'],
        min: [0, 'Product price cannot be less than 0']
    },
    quantity: {
        type: Number,
        unique: false,
        required: [true, 'Product quantity is required'],
        min: [0, 'Product quantity cannot be less than 0']
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    discount_type: {
        type: String,
        trim: true,
        enum: ['percent', 'amount'],
        default: 'amount'
    },
    avaialable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    product_id: {
        type: String,
        trim: true
    },
    brand: {
        type: String,
        trim: true,
        unique: false,
        required: [true, 'Brand name is required'],
        minlength: [3, 'Brand name must be at least 3 characters long'],
        maxlength: [255, 'Brand name cannot be more than 255 characters']
    },
    name: {
        type: String,
        trim: true,
        unique: false,
        required: [true, 'Product name is required'],
        minlength: [3, 'Product name must be at least 3 characters long'],
        maxlength: [255, 'Product name cannot be more than 255 characters']
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'Product description is required'],
        minlength: [3, 'Product description must be at least 3 characters long'],
        maxlength: [1024, 'Product description cannot be more than 512 characters']
    },
    image: {
        type: String,
        trim: true,
        required: [true, 'Product image is required']
    },
    category: {
        ref: 'category',
        type: mongoose.Schema.ObjectId,
        index: true,
        required: [true, 'Product category is required']
    },
    sub_category: {
        ref: 'sub_category',
        type: mongoose.Schema.ObjectId,
        index: true,
        required: [true, 'Product sub-category is required']
    },
    variants: [variantSchema],
    is_featured: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: Boolean,
        default: true
    },
    quantity_type: {
        type: String,
        trim: true,
        enum: ['ml', 'l', 'g', 'kg', 'unit'],
        default: 'unit'
    },
}, { timestamps: true });

productSchema.index({ brand: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('product', productSchema);

