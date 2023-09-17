const { User } = require('../models');
const { generateJwtToken } = require('../utils/auth');

const registerUser = ({ email, phoneNumber, password, name }) => new Promise(async (resolve, reject) => {
    try {
        // Check if user exists
        const user = await User.findOne({ $or: [{ email }, { phone_number: phoneNumber }] });
        if (user) return reject({ status: 409, msg: 'User already exists' });

        // Create new user
        let newUser = {
            phone_number: phoneNumber,
            password,
            name
        };
        if (email) newUser.email = email;

        // Save user
        newUser = new User(newUser);
        newUser = await newUser.save();

        return resolve({
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phone_number: newUser.phoneNumber
        });
    } catch (err) {
        console.error(`⚡[server][UserControllers][registerUser][${email}] Error while registering user:`, err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

const loginUser = ({ username, password }) => new Promise(async (resolve, reject) => {
    try {
        // Check if user exists
        const user = await User.findOne({ $or: [{ email: username }, { phone_number: username }] });
        if (!user) return reject({ status: 401, msg: 'Invalid Credentials' });

        // Check password
        if (!user.authenticate(password)) return reject({ status: 401, msg: 'Invalid Credentials' });

        // Generate and return JWT token
        const userPayload = {
            id: user._id,
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            role: 'user'
        };

        const jwtToken = generateJwtToken(userPayload);

        return resolve(jwtToken);
    } catch (err) {
        console.error(`⚡[server][UserControllers][loginUser][${username}] Error while logging in user:`, err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

const getAllUsers = () => new Promise(async (resolve, reject) => {
    try {
        const users = await User.find({}, { hashed_password: 0, salt: 0 });
        return resolve(users);
    } catch (err) {
        console.error(`⚡[server][UserControllers][getAllUsers] Error while getting all users:`, err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

const getUserById = ({ id }) => new Promise(async (resolve, reject) => {
    try {
        const user = await User.findById(id, { hashed_password: 0, salt: 0 });
        if (!user) return reject({ status: 404, msg: 'User not found' });
        return resolve(user);
    } catch (err) {
        console.error(`⚡[server][UserControllers][getUserById] Error while getting user by id:`, err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

const getUserByEmailOrPhoneNumber = ({ username }) => new Promise(async (resolve, reject) => {
    try {
        const user = await User.findOne({ $or: [{ email: username }, { phone_number: username }] }, { hashed_password: 0, salt: 0 });
    } catch (err) {
        console.error(`⚡[server][UserControllers][getUserByEmailOrPhoneNumber] Error while getting user by email or phone number:`, err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    getUserByEmailOrPhoneNumber
};