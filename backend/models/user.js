const mongoose = require('mongoose');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [4, 'Name must be at least 4 characters long'],
        maxlength: [255, 'Name cannot be more than 255 characters'],
        trim: true
    },
    hashed_password: {
        type: String,
        required: [true, 'Password is required']
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        index: true,
        minlength: [4, 'Email must be at least 4 characters long'],
        maxlength: [255, 'Email cannot be more than 255 characters'],
    },
    phone_number: {
        type: String,
        trim: true,
        unique: true,
        index: true,
        required: [true, 'Phone number is required'],
        minlength: [10, 'Phone number must be at least 10 characters long'],
        maxlength: [10, 'Phone number cannot be more than 10 characters'],
    },
    salt: {
        type: String,
        default: uuidv4()
    }
}, { timestamps: true });

userSchema.virtual('password')
    .set(function (plainPassword) {
        const hashedPassword = this.encryptPassword(plainPassword);
        if (hashedPassword) {
            this.hashed_password = hashedPassword;
        } else {
            throw new Error('Error while hashing password');
        }
    });

userSchema.methods = {
    encryptPassword: function (plainPassword) {
        if (!plainPassword) return '';
        try {
            return crypto.createHmac("sha256", this.salt)
                .update(plainPassword)
                .digest("hex");
        } catch (err) {
            return "";
        }
    },
    authenticate: function (plainPassword) {
        if (!this.hashed_password) return false;
        const hashedPassword = this.encryptPassword(plainPassword);
        if (hashedPassword) return crypto.timingSafeEqual(Buffer.from(hashedPassword), Buffer.from(this.hashed_password));
        return false;
    }
};

module.exports = mongoose.model('User', userSchema);