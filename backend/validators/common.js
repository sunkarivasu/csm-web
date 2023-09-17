const mongoose = require('mongoose');

const validateObjectId = (req, res, next, id) => {
    id = req.params.id || id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'Invalid Object Id' });
    }

    next();
};

const validateLimit = (req, res, next) => {
    if (isNaN(req.params.limit) || req.params.limit < 0) {
        return res.status(400).json({ msg: 'Invalid Limit' });
    }

    next();
};

module.exports = {
    validateObjectId,
    validateLimit
};