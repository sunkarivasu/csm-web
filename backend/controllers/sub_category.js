const { Category, SubCategory } = require('../models');

const getSubCategories = () => new Promise(async (resolve, reject) => {
    try {
        const subCategories = await SubCategory.find(
            {},
            { _id: 1, name: 1, description: 1, image: 1, category: 1 }
        ).
            populate('category', '_id name');

        let subCategoriesGrouped = {};

        subCategories.forEach(subCategory => {
            if (!subCategoriesGrouped[subCategory.category._id]) {
                subCategoriesGrouped[subCategory.category._id] = {
                    name: subCategory.category.name,
                    subCategories: []
                };
            }
            subCategoriesGrouped[subCategory.category._id].subCategories.push({
                id: subCategory._id,
                name: subCategory.name,
                description: subCategory.description,
                image: subCategory.image
            });
        });

        return resolve(subCategoriesGrouped);
    } catch (err) {
        console.error('⚡[server][CategoryControllers][getCategories] Error while getting categories:', err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

const getSubCategoryById = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const subCategory = await SubCategory.findById(id, { _id: 1, name: 1, description: 1, image: 1, category: 1 })
            .populate('category', '_id name');

        if (!subCategory) return reject({ status: 404, msg: 'Sub Category not found' });

        return resolve(subCategory);
    } catch (err) {
        console.error(`⚡[server][CategoryControllers][getCategoryById][${id}] Error while getting category by id:`, err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

const addSubCategory = ({ name, description, image, category: categoryId }) => new Promise(async (resolve, reject) => {
    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) return reject({ status: 404, msg: 'Category not found' });

    // Check if sub-category exists
    const subCategory = await SubCategory.findOne({ name, category: categoryId });
    if (subCategory) return reject({ status: 409, msg: 'Sub Category already exists' });

    // Create new sub-category
    let newSubCategory = {
        name,
        category: categoryId
    };
    if (description) newSubCategory.description = description;
    if (image) newSubCategory.image = image;

    // Save sub-category
    newSubCategory = new SubCategory(newSubCategory);
    newSubCategory = await newSubCategory.save();

    return resolve({
        id: newSubCategory._id,
        name: newSubCategory.name,
        description: newSubCategory.description,
        image: newSubCategory.image,
        category: newSubCategory.category
    });
});

const deleteSubCategory = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        // check if sub-category exists
        const subCategory = await SubCategory.findById(id);
        if (!subCategory) return reject({ status: 404, msg: 'Sub Category not found' });

        // Delete sub-category
        await SubCategory.findByIdAndDelete(id);

        return resolve();
    } catch (err) {
        console.error('⚡[server][CategoryControllers][deleteCategory] Error while deleting category:', err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

module.exports = {
    addSubCategory,
    getSubCategories,
    deleteSubCategory,
    getSubCategoryById
}