const passport = require('passport');
const { isAdmin } = require('../validators/role');
const { validateSubCategory } = require('../validators/sub_category');
const { addSubCategory, getSubCategories, getSubCategoryById, deleteSubCategory } = require('../controllers/sub_category');

const router = require('express').Router();


// route    :: GET /api/sub-category
// access   :: Public
// desc     :: Get All Sub Categories
router.get(
    '/',
    (req, res) => {
        getSubCategories()
            .then(subCategories => res.json({ msg: "Sub Categories List", data: { subCategories } }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    }
);

// route    :: GET /api/sub-category/:id
// access   :: Public
// desc     :: Get Sub Category by ID
router.get(
    '/:id',
    (req, res) => {
        getSubCategoryById({ id: req.params.id })
            .then(subCategory => res.json({ msg: "Sub Category", data: { subCategory } }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    });

// route    :: POST /api/sub-category
// access   :: Admin
// desc     :: Add a Sub Category
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    validateSubCategory,
    (req, res) => {
        const data = {
            category: req.body.category,
            name: req.body.name,
            description: req.body.description || '',
            image: req.body.image || ''
        };

        addSubCategory(data)
            .then(sub_category => res.json({ msg: "Sub Category added", data: { sub_category } }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    });

// route    :: PUT /api/sub-category/:id
// access   :: Admin
// desc     :: Update a Sub Category
router.put('/:id', (req, res) => res.json({ msg: "Updated Sub Category: " + req.params.id }));

// route    :: DELETE /api/sub-category/:id
// access   :: Admin
// desc     :: Delete a Sub Category
router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    (req, res) => {
        deleteSubCategory({ id: req.params.id })
            .then(sub_category => res.json({ msg: "Sub Category deleted", data: { sub_category } }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    });

module.exports = router;