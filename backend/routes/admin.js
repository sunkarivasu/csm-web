const router = require("express").Router();
const passport = require("passport");
const {
    registerAdmin,
    loginAdmin,
    updateAdminPassword,
    forgotPassword,
    resetAdminPassword,
    deleteAdmin,
    getAdmins
} = require('../controllers/admin');
const {
    validateAdminRegistration,
    validateAdminLogin,
    validateUpdatePassword,
    validateForgotPassword,
    validateOtp,
    validateResetPassword,
} = require('../validators/admin');
const { isSuperAdmin } = require('../validators/role');

// route    :: GET /api/admins
// access   :: Super Admin
// desc     :: Get all admins
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    isSuperAdmin,
    (req, res) => {
        getAdmins()
            .then(admins => res.json({ msg: 'Admins fetched successfully', data: { admins } }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    }
);

// route    :: POST /api/admins/register
// access   :: Super Admin
// desc     :: Admin Registration
router.post(
    '/register',
    passport.authenticate('jwt', { session: false }),
    isSuperAdmin,
    validateAdminRegistration,
    (req, res) => {
        const data = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password || '',
            allow_password_change: req.body.allow_password_change || false
        };

        registerAdmin(data)
            .then(admin => res.json({ msg: `Admin registered. Instructions are mailed to respective user`, data: { admin } }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    }
);

// route    :: POST /api/admins/login
// access   :: Public
// desc     :: Admin Login
router.post(
    '/login',
    validateAdminLogin,
    (req, res) => {
        const data = {
            email: req.body.email,
            password: req.body.password
        };

        loginAdmin(data)
            .then(token => res.json({ msg: 'Admin Logged In Successfully', data: { token } }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    }
);

// route    :: POST /api/admins/update-password
// access   :: public
// desc     :: Update admin password
router.post(
    '/update-password',
    validateUpdatePassword,
    (req, res) => {
        const data = {
            password: req.body.password,
            token: req.headers.authorization
        };

        updateAdminPassword(data)
            .then(token => res.json({ msg: 'Admin password updated successfully', data: { token } }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    }
);

// route    :: POST /api/admins/forgot-password
// access   :: public
// desc     :: Send Password reset link to admin
router.post(
    '/forgot-password',
    validateForgotPassword,
    (req, res) => {
        forgotPassword({ email: req.body.email })
            .then(hash => res.json({ msg: `Password reset link sent to ${req.body.email}`, data: { hash } }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    }
);

// route    :: POST /api/admins/reset-password
// access   :: public
// desc     :: Reset admin password
router.post(
    '/reset-password',
    validateResetPassword,
    (req, res) => {
        const data = {
            email: req.body.email,
            password: req.body.password,
            otp: req.body.otp,
            otpHash: req.body.otp_hash
        };

        resetAdminPassword(data)
            .then(token => res.json({ msg: 'Admin password updated successfully', data: { token } }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    }
);

// route    :: DELETE /api/admins/:id
// access   :: Super Admin
// desc     :: Delete Admin
router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    isSuperAdmin,
    (req, res) => {
        deleteAdmin({ userId: req.params.id })
            .then(admin => res.json({ msg: `Admin deleted successfully`, data: { admin } }))
            .catch(err => res.status(err.status || 500).json({ msg: err.msg || 'Internal Server Error', err: err.err || {} }));
    }
);

module.exports = router;