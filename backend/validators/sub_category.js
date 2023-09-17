const mongoose = require("mongoose");
const { trimReqBody, isEmpty, isValidHttpUrl, namitize } = require("../utils/validators");

const validateSubCategory = (req, res, next) => {
    let errors = {};

    // Trim Request Body
    req.body = trimReqBody(req.body);

    // Category Id Validation
    if (isEmpty(req.body.category)) {
        errors.category = "Category ID is required";
    } else if (typeof req.body.category !== 'string') {
        errors.category = "Category ID is invalid";
    } else if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
        errors.category = "Category ID is invalid";
    }

    // Sub Category Name Validation
    if (isEmpty(req.body.name)) {
        errors.name = "Sub Category name is required";
    } else if (typeof req.body.name !== 'string') {
        errors.name = "Sub Category name is invalid";
    } else if (req.body.name.length < 3 || req.body.name.length > 255) {
        errors.name = "Sub Category name must be between 3 and 255 characters";
    } else {
        req.body.name = namitize(req.body.name);
    }

    // Sub Category Description Validation
    if (!isEmpty(req.body.description)) {
        if (typeof req.body.description !== 'string') {
            errors.description = "Sub Category description is invalid";
        } else if (req.body.description.length < 3 || req.body.description.length > 1024) {
            errors.description = "Sub Category description must be between 3 and 1024 characters";
        }
    }

    // Sub Category Image Url Validation
    if (!isEmpty(req.body.image)) {
        if (typeof req.body.image !== 'string') {
            errors.image = "Sub Category image URL is invalid";
        } else if (req.body.image.length < 3 || req.body.image.length > 512) {
            errors.image = "Sub Category image URL must be between 3 and 512 characters";
        } else if (!isValidHttpUrl(req.body.image)) {
            errors.image = "Sub Category image URL is invalid";
        }
    }

    // check if errors exist
    if (!isEmpty(errors)) {
        return res.status(422).json({ msg: "Validation Error", errors: errors });
    }

    next();
}

module.exports = {
    validateSubCategory
};