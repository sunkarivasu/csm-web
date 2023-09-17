const {
    Product,
    Category,
    SubCategory
} = require('../models');

const getAllProducts = (conditions = {}, limit = 0) => new Promise(async (resolve, reject) => {
    try {
        const products = await Product.find(conditions)
            .populate('category', '_id name')
            .populate('sub_category', '_id name')
            .sort({ createdAt: -1 })
            .limit(limit);

        return resolve(products);
    } catch (err) {
        console.error(`⚡[server][ProductControllers][getAllProducts] Error while getting all products:`, err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

const getProductById = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const product = await Product.findById(id)
            .populate('category', '_id name')
            .populate('sub_category', '_id name');
        if (!product) return reject({ status: 404, msg: 'Product not found' });
        return resolve(product);
    } catch (err) {
        console.error(`⚡[server][ProductControllers][getProductById][${id}] Error while getting product by id:`, err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

const addProduct = (data) => new Promise(async (resolve, reject) => {
    try {
        // Check if product exists
        const product = await Product.findOne({ brand: data.brand, name: data.name });
        if (product) return reject({ status: 409, msg: 'Product already exists' });

        // Create new product
        let newProduct = {
            brand: data.brand,
            name: data.name,
            description: data.description,
            image: data.image,
            category: data.category,
            sub_category: data.subCategory,
            variants: []
        };
        Object.keys(data).includes('productId') && (newProduct.product_id = data.productId);
        Object.keys(data).includes('isFeatured') && (newProduct.is_featured = data.isFeatured);
        Object.keys(data).includes('isActive') && (newProduct.is_active = data.isActive);
        Object.keys(data).includes('quantityType') && (newProduct.quantity_type = data.quantityType);

        data.variants.forEach(variant => {
            let variantData = {
                price: variant.price,
                quantity: variant.quantity
            };
            Object.keys(variant).includes('discount') && (variantData.discount = variant.discount);
            Object.keys(variant).includes('discountType') && (variantData.discount_type = variant.discountType);
            Object.keys(variant).includes('available') && (variantData.available = variant.available);

            newProduct.variants.push(variantData);
        });
        newProduct = new Product(newProduct);
        await newProduct.save();

        return resolve(newProduct);
    } catch (err) {
        console.error(`⚡[server][ProductControllers][addProduct][${data.name}] Error while adding product:`, err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

const deleteProduct = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        // Check if product exists
        const product = await Product.findById(id);
        if (!product) return reject({ status: 404, msg: 'Product not found' });

        // Delete product
        await Product.findByIdAndDelete(id);

        return resolve();
    } catch (err) {
        console.error(`⚡[server][ProductControllers][deleteProduct][${id}] Error while deleting product:`, err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

const getProductsByCategory = (params) => new Promise(async (resolve, reject) => {
    try {
        // Check if category exists
        const category = await Category.findById(params.categoryId);
        if (!category) return reject({ status: 404, msg: 'Category not found' });

        // Get products by category
        const products = await getAllProducts({ category: params.categoryId }, limit = params.limit || 0);

        return resolve({
            category: products[0].category.name,
            sub_category: products[0].sub_category.name,
            products
        });
    } catch (err) {
        console.error(`⚡[server][ProductControllers][getProductsByCategory][${params.categoryId}] Error while getting products by category:`, err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

const getProductsBySubCategory = ({ subCategoryId }) => new Promise(async (resolve, reject) => {
    try {
        // Check if sub category exists
        const subCategory = await SubCategory.findById(subCategoryId);
        if (!subCategory) return reject({ status: 404, msg: 'Sub Category not found' });

        // Get products by sub category
        const products = await getAllProducts({ sub_category: subCategoryId });

        return resolve({
            category: products[0].category.name,
            sub_category: products[0].sub_category.name,
            products
        });
    } catch (err) {
        console.error(`⚡[server][ProductControllers][getProductsBySubCategory][${subCategoryId}] Error while getting products by sub category:`, err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

const getLatestProducts = ({ limit }) => new Promise(async (resolve, reject) => {
    try {
        // Get latest products
        const products = await getAllProducts({}, limit);

        return resolve({ products });
    } catch (err) {
        console.error(`⚡[server][ProductControllers][getLatestProducts] Error while getting latest products:`, err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

const getLatestProductsByCategory = ({ categoryId, limit }) => new Promise(async (resolve, reject) => {
    try {
        // check if category exists
        const category = await Category.findById(categoryId);
        if (!category) return reject({ status: 404, msg: 'Category not found' });

        // Get latest products by category
        const products = await getAllProducts({ category: categoryId }, limit);

        return resolve({
            category: products[0].category.name,
            sub_category: products[0].sub_category.name,
            products
        });
    } catch (err) {
        console.error(`⚡[server][ProductControllers][getLatestProductsByCategory][${categoryId}] Error while getting latest products by category:`, err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

const getLatestProductsInAllCategory = ({ limit }) => new Promise(async (resolve, reject) => {
    try {
        // get all categories
        const categories = await Category.find();

        // Get latest products in all category
        let products = [];
        for (const category of categories) {
            let categoryProducts = await getAllProducts({ category: category._id }, limit);
            if (categoryProducts.length === 0) continue;
            products.push({
                category: category.name,
                sub_category: categoryProducts[0].sub_category.name,
                products: categoryProducts
            });
        }

        return resolve({ products });
    } catch (err) {
        console.error(`⚡[server][ProductControllers][getLatestProductsInAllCategory] Error while getting latest products in all category:`, err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

module.exports = {
    addProduct,
    getAllProducts,
    getProductById,
    deleteProduct,
    getProductsByCategory,
    getProductsBySubCategory,
    getLatestProducts,
    getLatestProductsByCategory,
    getLatestProductsInAllCategory
};