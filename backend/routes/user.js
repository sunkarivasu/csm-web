const router = require('express').Router();
const passport = require('passport');
const {
    validateUserRegistration,
    validateUserLogin
} = require('../validators/user');
const {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById
} = require('../controllers/user');
const { isSuperAdmin, isAdminOrSelf } = require('../validators/role');


// route    :: GET /api/user
// access   :: Super Admin
// desc     :: Get all users
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    isSuperAdmin,
    (req, res) => {
        getAllUsers()
            .then(users => res.json({ msg: `Users fetched successfully`, data: { users } }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    }
);

// route    :: GET /api/user/:id
// access   :: Admin || User
// desc     :: Get user by id
router.get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    isAdminOrSelf,
    (req, res) => {
        getUserById({ id: req.params.id })
            .then(user => res.json({ msg: `User fetched successfully`, data: { user } }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    }
);

// route    :: POST /api/user
// access   :: Public
// desc     :: User Registration
router.post(
    '/',
    validateUserRegistration,
    (req, res) => {
        const data = {
            name: req.body.name,
            email: req.body.email || '',
            password: req.body.password,
            phoneNumber: req.body.phone_number,
        };

        registerUser(data)
            .then(user => res.json({ msg: `User registered successfully`, data: { user } }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    }
);

// route    :: POST /api/user/login
// access   :: Public
// desc     :: User Login
router.post(
    '/login',
    validateUserLogin,
    (req, res) => {
        const data = {
            username: req.body.username,
            password: req.body.password
        };

        loginUser(data)
            .then(token => res.json({ msg: `User logged in successfully`, data: { token } }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    }
);

module.exports = router;