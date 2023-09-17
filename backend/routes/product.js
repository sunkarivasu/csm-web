const router = require('express').Router();
const passport = require('passport');
const { isAdmin } = require('../validators/role');
const { validateObjectId, validateLimit } = require('../validators/common');
const { validateProduct } = require('../validators/product');
const {
    addProduct,
    getAllProducts,
    getProductById,
    deleteProduct,
    getProductsByCategory,
    getProductsBySubCategory,
    getLatestProducts,
    getLatestProductsByCategory,
    getLatestProductsInAllCategory
} = require('../controllers/product');


// route    :: GET /api/product
// access   :: Public
// desc     :: Get All Products
router.get(
    '/',
    (req, res) => {
        getAllProducts()
            .then(products => res.json({ msg: "Fetched all products", data: { products } }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    }
);

// route    :: GET /api/product/:id
// access   :: Public
// desc     :: Get Product by ID
router.get(
    '/:id',
    (req, res, next) => validateObjectId(req, res, next, req.params.id),
    (req, res) => {
        getProductById({ id: req.params.id })
            .then(product => res.json({ msg: "Fetched product", data: { product } }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    });

// route    :: POST /api/product
// access   :: Admin
// desc     :: Add a Product
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    validateProduct,
    (req, res) => {
        let data = {
            brand: req.body.brand,
            name: req.body.name,
            description: req.body.description,
            image: req.body.image,
            category: req.body.category,
            subCategory: req.body.sub_category,
            variants: []
        };
        Object.keys(req.body).includes('product_id') && (data.productId = req.body.product_id);
        Object.keys(req.body).includes('is_featured') && (data.isFeatured = req.body.is_featured);
        Object.keys(req.body).includes('is_active') && (data.isActive = req.body.is_active);
        addProduct
        Object.keys(req.body).includes('quantity_type') && (data.quantityType = req.body.quantity_type);

        req.body.variants.forEach(variant => {
            let variantData = {
                price: variant.price,
                quantity: variant.quantity
            };
            Object.keys(variant).includes('discount') && (variantData.discount = variant.discount);
            Object.keys(variant).includes('discount_type') && (variantData.discountType = variant.discount_type);
            Object.keys(variant).includes('available') && (variantData.available = variant.available);

            data.variants.push(variantData);
        });

        addProduct(data)
            .then(product => res.json({ msg: "Product added", data: { product } }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    }
);

// route    :: PUT /api/product/:id
// access   :: Admin
// desc     :: Update a Product
router.put('/:id', (req, res) => res.json({ msg: "Updated Product: " + req.params.id }));

// route    :: DELETE /api/product/:id
// access   :: Admin
// desc     :: Delete a Product
router.delete(
    '/:id',
    (req, res, next) => validateObjectId(req, res, next, req.params.id),
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    (req, res) => {
        deleteProduct({ id: req.params.id })
            .then(product => res.json({ msg: "Product deleted", data: { product } }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    }
);

// route    :: GET /api/product/categoty/:category
// access   :: Public
// desc     :: Get Products by Category
router.get(
    '/category/:category',
    (req, res, next) => validateObjectId(req, res, next, req.params.category),
    (req, res) => {
        getProductsByCategory({ categoryId: req.params.category })
            .then(products => res.json({ msg: "Fetched products", data: products }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    }
);

// route    :: GET /api/product/latest/:limit
// access   :: Public
// desc     :: Get latest Products
router.get(
    '/latest/:limit',
    validateLimit,
    (req, res) => {
        getLatestProducts({ limit: req.params.limit })
            .then(data => res.json({ msg: "Fetched latest products", data }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    }
);

// route    :: GET /api/product/latest/:limit/category
// access   :: Public
// desc     :: Get latest Products in all Category
router.get(
    '/latest/:limit/category',
    validateLimit,
    (req, res) => {
        getLatestProductsInAllCategory({ limit: req.params.limit })
            .then(data => res.json({ msg: "Fetched latest products", data }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    }
);

// route    :: GET /api/product/latest/:limit/category/:category
// access   :: Public
// desc     :: Get latest Products by Category
router.get(
    '/latest/:limit/category/:category',
    validateLimit,
    (req, res, next) => validateObjectId(req, res, next, req.params.category),
    (req, res) => {
        getLatestProductsByCategory({ limit: req.params.limit, categoryId: req.params.category })
            .then(data => res.json({ msg: "Fetched latest products", data }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    }
);

// route    :: GET /api/product/sub-categoty/:sub_category
// access   :: Public
// desc     :: Get Products by Sub Category
router.get(
    '/sub-category/:sub_category',
    (req, res, next) => validateObjectId(req, res, next, req.params.sub_category),
    (req, res) => {
        getProductsBySubCategory({ subCategoryId: req.params.sub_category })
            .then(products => res.json({ msg: "Fetched products", data: products }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    }
);



module.exports = router;