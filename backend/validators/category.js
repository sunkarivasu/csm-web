const { isEmpty, trimReqBody, namitize, isValidHttpUrl } = require('../utils/validators');

const validateCategory = (req, res, next) => {
    let errors = {};

    // Trim Request Body
    req.body = trimReqBody(req.body);

    // Category Name Validation
    if (isEmpty(req.body.name)) {
        errors.name = "Category name is required";
    } else if (typeof req.body.name !== 'string') {
        errors.name = "Category name is invalid";
    } else if (req.body.name.length < 3 || req.body.name.length > 255) {
        errors.name = "Category name must be between 3 and 255 characters";
    } else {
        req.body.name = namitize(req.body.name);
    }

    // Description Validation
    if (!isEmpty(req.body.description)) {
        if (typeof req.body.description !== 'string') {
            errors.description = "Category description is invalid";
        } else if (req.body.description.length < 3 || req.body.description.length > 1024) {
            errors.description = "Category description must be between 3 and 1024 characters";
        }
    }

    // Image Url Validation
    if (isEmpty(req.body.image)) {
        errors.image = "Category image is required";
    } else if (typeof req.body.image !== 'string') {
        errors.image = "Category image is invalid";
    } else if (req.body.image.length < 3 || req.body.image.length > 512) {
        errors.image = "Category image must be between 3 and 512 characters";
    } else if (!isValidHttpUrl(req.body.image)) {
        errors.image = "Category image is invalid";
    }

    // Check if errors exist
    if (!isEmpty(errors)) {
        return res.status(422).json({ msg: "Validation Error", errors: errors });
    }

    next();
};

module.exports = {
    validateCategory
};