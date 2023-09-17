const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        index: true,
        required: [true, 'Category ID is required']
    },
    name: {
        type: String,
        trim: true,
        index: true,
        required: [true, 'Sub Category name is required'],
        minlength: [3, 'Sub Category name must be at least 3 characters long'],
        maxlength: [255, 'Sub Category name cannot be more than 255 characters']
    },
    description: {
        type: String,
        trim: true,
        minlength: [3, 'Sub Category description must be at least 3 characters long'],
        maxlength: [1024, 'Sub Category description cannot be more than 1024 characters']
    },
    image: {
        type: String,
        trim: true,
        minlength: [3, 'Sub Category image must be at least 3 characters long'],
        maxlength: [255, 'Sub Category image cannot be more than 255 characters']
    }
}, { timestamps: true });

const SubCategory = mongoose.model('sub_category', subCategorySchema);

module.exports = SubCategory;