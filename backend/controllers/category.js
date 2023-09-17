const Category = require('../models/category');

const getCategories = () => new Promise(async (resolve, reject) => {
    try {
        const categories = await Category.find({}, { _id: 1, name: 1, description: 1, image: 1 });
        return resolve(categories);
    } catch (err) {
        console.error('⚡[server][CategoryControllers][getCategories] Error while getting categories:', err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

const getCategoryById = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const category = await Category.findById(id, { _id: 1, name: 1, description: 1, image: 1 });
        if (!category) return reject({ status: 404, msg: 'Category not found' });
        return resolve(category);
    } catch (err) {
        console.error(`⚡[server][CategoryControllers][getCategoryById][${id}] Error while getting category by id:`, err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

const addCategory = ({ name, description, image }) => new Promise(async (resolve, reject) => {
    try {
        // Check if category exists
        const category = await Category.findOne({ name });
        if (category) return reject({ status: 409, msg: 'Category already exists' });

        // Create new category
        let newCategory = {
            name,
            image
        };
        if (description) newCategory.description = description;

        // Save category
        newCategory = new Category(newCategory);
        newCategory = await newCategory.save();

        return resolve({
            id: newCategory._id,
            name: newCategory.name,
            description: newCategory.description,
            image: newCategory.image
        });
    } catch (err) {
        console.error(`⚡[server][CategoryControllers][addCategory][${name}] Error while adding category:`, err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

const updateCategory = ({ id, name, description, image }) => new Promise(async (resolve, reject) => { });

const deleteCategory = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        // Check if category exists
        const category = await Category.findById(id);
        if (!category) return reject({ status: 404, msg: 'Category not found' });

        // Delete category
        await Category.findByIdAndDelete(id);

        return resolve();
    } catch (err) {
        console.error(`⚡[server][CategoryControllers][deleteCategory][${id}] Error while deleting category:`, err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

module.exports = {
    addCategory,
    getCategories,
    getCategoryById,
    deleteCategory
};