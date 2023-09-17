const mongoose = require('mongoose');
const constants = require('../utils/constants');
const { isEmpty, trimReqBody, isValidHttpUrl, namitize } = require('../utils/validators');

const validateProduct = (req, res, next) => {
    let errors = {};

    // Trim Request Body
    req.body = trimReqBody(req.body);

    // Product Id Validation
    if (!isEmpty(req.body.product_id)) {
        if (typeof req.body.product_id !== 'string') {
            errors.product_id = "Product ID is invalid";
        } else if (req.body.product_id.length < 3) {
            errors.product_id = "Product ID must be at least 3 characters";
        } else if (req.body.product_id.length > 255) {
            errors.product_id = "Product ID must be at most 255 characters";
        }
    }

    // Brand Name Validation
    if (isEmpty(req.body.brand)) {
        errors.brand = "Brand name is required";
    } else if (typeof req.body.brand !== 'string') {
        errors.brand = "Brand name is invalid";
    } else if (req.body.brand.length < 3 || req.body.brand.length > 255) {
        errors.brand = "Brand name must be between 3 and 255 characters";
    } else {
        req.body.brand = namitize(req.body.brand);
    }


    // Product Name Validation
    if (isEmpty(req.body.name)) {
        errors.name = "Product name is required";
    } else if (typeof req.body.name !== 'string') {
        errors.name = "Product name is invalid";
    } else if (req.body.name.length < 3 || req.body.name.length > 255) {
        errors.name = "Product name must be between 3 and 255 characters";
    } else {
        req.body.name = namitize(req.body.name);
    }

    // Description Validation
    if (isEmpty(req.body.description)) {
        errors.description = "Product description is required";
    } else if (typeof req.body.description !== 'string') {
        errors.description = "Description is invalid";
    } else if (req.body.description.length < 3 || req.body.description.length > 1024) {
        errors.description = "Description must be between 3 and 1024 characters";
    }

    // Image Url Validation
    if (typeof req.body.image !== 'string') {
        errors.image = "Image URL is invalid";
    } else if (req.body.image.length < 3 || req.body.image.length > 512) {
        errors.image = "Image URL must be between 3 and 512 characters";
    } else if (!isValidHttpUrl(req.body.image)) {
        errors.image = "Image URL is invalid";
    }

    // Category Id Validation
    if (isEmpty(req.body.category)) {
        errors.category = "Category ID is required";
    } else if (typeof req.body.category !== 'string') {
        errors.category = "Category ID is invalid";
    } else if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
        errors.category = "Category ID is invalid";
    }

    // Sub Category Id Validation
    if (isEmpty(req.body.sub_category)) {
        errors.sub_category = "Sub Category ID is required";
    } else if (typeof req.body.sub_category !== 'string') {
        errors.sub_category = "Sub Category ID is invalid";
    } else if (!mongoose.Types.ObjectId.isValid(req.body.sub_category)) {
        errors.sub_category = "Sub Category ID is invalid";
    }

    // Variants Validation
    if (isEmpty(req.body.variants)) {
        errors.variants = 'Atleast one variant is required';
    } else if (!Array.isArray(req.body.variants)) {
        errors.variants = 'Variants must be an array';
    } else {
        let quantityList = [];
        req.body.variants.forEach(variant => {
            if (isEmpty(variant.price)) {
                errors.variants = 'Variant price is required';
            } else if (typeof variant.price !== 'number') {
                errors.variants = 'Variant price is invalid';
            } else if (variant.price < 0) {
                errors.variants = 'Variant price must be greater than 0';
            }

            if (isEmpty(variant.quantity)) {
                errors.variants = 'Variant quantity is required';
            } else if (typeof variant.quantity !== 'number') {
                errors.variants = 'Variant quantity is invalid';
            } else if (variant.quantity < 0) {
                errors.variants = 'Variant quantity must be greater than 0';
            } else {
                quantityList.includes(variant.quantity) ? errors.variants = 'Variant quantity must be unique' : quantityList.push(variant.quantity);
            }

            if (!isEmpty(variant.discount)) {
                if (typeof variant.discount !== 'number') {
                    errors.variants = 'Variant discount is invalid';
                } else if (variant.discount < 0) {
                    errors.variants = 'Variant discount must be greater than 0';
                }

                let discountType = constants.AMOUNT;

                if (!isEmpty(variant.discount_type)) {
                    if (typeof variant.discount_type !== 'string') {
                        errors.variants = 'Variant discount type is invalid';
                    } else if (!constants.DISCOUNT_TYPES.includes(variant.discount_type.toLowerCase())) {
                        errors.variants = 'Variant discount type is invalid';
                    } else {
                        discountType = variant.discount_type.toLowerCase();
                    }

                    if (discountType === constants.PERCENTAGE && (variant.discount > 100 || variant.discount < 0)) {
                        errors.variants = 'Variant discount must be between 0 and 100';
                    } else if (discountType === constants.AMOUNT && (variant.discount > variant.price || variant.discount < 0)) {
                        errors.variants = 'Variant discount must be between 0 and variant price';
                    }
                }
            }

            if (!isEmpty(variant.is_available) && typeof variant.is_available !== 'boolean') {
                errors.variants = 'Variant availability is invalid';
            }
        });
    }

    // Quantity Type Validation
    if (!isEmpty(req.body.quantity_type)) {
        if (typeof req.body.quantity_type !== 'string') {
            errors.quantity_type = "Quantity type is invalid";
        } else if (!constants.QUANTITY_TYPES.includes(req.body.quantity_type.toLowerCase())) {
            errors.quantity_type = "Quantity type is invalid";
        }
    }

    // is featured Validation
    if (!isEmpty(req.body.is_featured) && typeof req.body.is_featured !== 'boolean') {
        errors.is_featured = 'Featured is invalid';
    }

    // is active Validation
    if (!isEmpty(req.body.is_active) && typeof req.body.is_active !== 'boolean') {
        errors.is_active = 'Active is invalid';
    }

    // Check if there are any errors
    if (!isEmpty(errors)) {
        return res.status(422).json({ msg: 'Validation Failed', err: errors });
    }

    next();
};

module.exports = {
    validateProduct
};