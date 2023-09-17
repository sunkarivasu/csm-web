const { isEmpty, trimReqBody, namitize } = require('../utils/validators');
const { NAME_REGEX, EMAIL_REGEX, MOBILE_REGEX } = require('../utils/regexes');

const validateUserRegistration = (req, res, next) => {
    let errors = {};

    // trim the input fields
    req.body = trimReqBody(req.body);

    // Validate Name
    if (isEmpty(req.body.name)) {
        errors.name = "Name is required";
    } else if (req.body.name.length < 3) {
        errors.name = "Name must be at least 3 characters";
    } else if (req.body.name.length > 255) {
        errors.name = "Name must be at most 255 characters";
    } else if (!NAME_REGEX.test(req.body.name)) {
        errors.name = "Name must contain only letters and spaces";
    } else {
        req.body.name = namitize(req.body.name);
    }

    // Validate Email
    if (!isEmpty(req.body.email)) {
        if (typeof req.body.email !== 'string') {
            errors.email = "Email is invalid";
        } else if (req.body.email.length > 255) {
            errors.email = "Email must be at most 255 characters";
        } else if (!EMAIL_REGEX.test(req.body.email)) {
            errors.email = "Email is invalid";
        } else {
            req.body.email = req.body.email.toLowerCase();
        }
    }

    // Validate Phone Number
    if (isEmpty(req.body.phone_number)) {
        errors.phone_number = "Phone Number is required";
    } else if (!MOBILE_REGEX.test(req.body.phone_number)) {
        errors.phone_number = "Phone Number is invalid";
    }

    // Validate Password
    if (isEmpty(req.body.password)) {
        errors.password = "Password is required";
    } else if (typeof req.body.password !== 'string') {
        errors.password = "Password is invalid";
    } else if (req.body.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
    }

    // check if there are any errors
    if (!isEmpty(errors)) {
        return res.status(422).json({ msg: 'Validation Failed', err: errors });
    };

    next();
};

const validateUserLogin = (req, res, next) => {
    let errors = {};

    // trim the input fields
    req.body = trimReqBody(req.body);

    // validate username
    if (isEmpty(req.body.username)) {
        errors.username = "Username is required";
    }

    // Validate Password
    if (isEmpty(req.body.password)) {
        errors.password = "Password is required";
    }

    // check if there are any errors
    if (!isEmpty(errors)) {
        return res.status(422).json({ msg: 'Validation Failed', err: errors });
    };

    next();
};

module.exports = {
    validateUserRegistration,
    validateUserLogin
};