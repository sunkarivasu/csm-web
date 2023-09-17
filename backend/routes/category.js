const router = require('express').Router();
const passport = require('passport');
const { validateCategory } = require('../validators/category');
const { addCategory, getCategories, getCategoryById, deleteCategory } = require('../controllers/category');
const { isAdmin } = require('../validators/role');

// route    :: GET /api/category
// access   :: Public
// desc     :: Get All Categories
router.get(
    '/',
    (req, res) => {
        getCategories()
            .then(categories => res.json({ msg: "Categories list", data: { categories } }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    }
);

// route    :: GET /api/category/:id
// access   :: Public
// desc     :: Get Category by ID
router.get(
    '/:id',
    (req, res) => {
        getCategoryById({ id: req.params.id })
            .then(category => res.json({ msg: "Category details", data: { category } }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    });

// route    :: POST /api/category
// access   :: Admin
// desc     :: Add a Category
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    validateCategory,
    (req, res) => {
        const data = {
            name: req.body.name,
            description: req.body.description || '',
            image: req.body.image,
        };
        addCategory(data)
            .then(category => res.json({ msg: "Category added", data: { category } }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    }
);

// route    :: PUT /api/category/:id
// access   :: Admin
// desc     :: Update a Category
router.put('/:id', (req, res) => res.json({ msg: "Updated Category: " + req.params.id }));

// route    :: DELETE /api/category/:id
// access   :: Admin
// desc     :: Delete a Category
router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    (req, res) => {
        deleteCategory({ id: req.params.id })
            .then(category => res.json({ msg: "Category deleted", data: { category } }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    });


module.exports = router;