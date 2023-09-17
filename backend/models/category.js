const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'Category name is required'],
        minlength: [3, 'Category name must be at least 3 characters long'],
        maxlength: [255, 'Category name cannot be more than 255 characters']
    },
    description: {
        type: String,
        trim: true,
        minlength: [3, 'Category description must be at least 3 characters long'],
        maxlength: [1024, 'Category description cannot be more than 1024 characters']
    },
    image: {
        type: String,
        trim: true,
        required: [true, 'Category image is required'],
        minlength: [3, 'Category image must be at least 3 characters long'],
        maxlength: [255, 'Category image cannot be more than 255 characters']
    }
}, { timestamps: true });

const Category = mongoose.model('category', categorySchema);

module.exports = Category;