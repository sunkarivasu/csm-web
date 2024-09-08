import {NAME_REGEX, EMAIL_REGEX} from '../constants/regex';

export const validateAdminForm = (formData) => {
    const NAME_REGEX = /^[a-zA-Z\s]+$/
    let errors = {};
    let isValid = true;

    // Name Validation
    if (!formData.name.trim()) {
        errors.name = "Name is required";
    } else if (!NAME_REGEX.test(formData.name)) {
        errors.name = "Name is invalid";
    } else if (formData.name.length < 3 || formData.name.length > 255) {
        errors.name = "Name must be between 3 to 255 characters";
    }

    // Email Validation
    if (!formData.email.trim()) {
        errors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(formData.email)) {
        errors.email = "Email is invalid";
    }

    // Password Validation
    if (formData.password.length > 0 && (formData.password.length < 8 || formData.password.length > 255)) {
        errors.password = "Password must be between 8 to 255 characters";
    }

    // Allow Password Change Validation
    if (formData.allow_password_change !== "true" && formData.allow_password_change !== "false") {
        errors.allow_password_change = "Please provide valid data";
    }

    // If errors object is not empty, set isValid to false
    if (Object.keys(errors).length > 0) {
        isValid = false;
    }
    console.log("return values", [isValid, errors]);
    return [isValid, errors];
}
