const constants = require('../utils/constants');

const isSuperAdmin = (req, res, next) => {
    if (req.user.role !== constants.SUPER_ADMIN) {
        return res.status(403).json({ msg: 'Forbidden' });
    }

    next();
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== constants.ADMIN && req.user.role !== constants.SUPER_ADMIN) {
        return res.status(403).json({ msg: 'Forbiddenn' });
    }

    next();
};

const isAdminOrSelf = (req, res, next) => {
    if (req.user.role === constants.ADMIN || req.user.role === constants.SUPER_ADMIN || req.user.id === req.params.id) {
        next();
    } else {
        res.status(403).json({ msg: "Forbidden" });
    }
};

const isSelf = (req, res, next) => {
    if (req.user.id === req.params.id) {
        next();
    } else {
        res.status(403).json({ msg: "Forbidden" });
    }
};

module.exports = {
    isSuperAdmin,
    isAdmin,
    isAdminOrSelf,
    isSelf
};