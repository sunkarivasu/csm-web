const {
    Strategy,
    ExtractJwt
} = require('passport-jwt');
const constants = require('../utils/constants');
const {
    Admin,
    User
} = require("../models");


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

module.exports = passport => {
    passport.use(new Strategy(opts, async (payload, done) => {
        try {
            if (payload.role === constants.ADMIN || payload.role === constants.SUPER_ADMIN) {
                const admin = await Admin.findById(payload.id);
                if (admin && admin.allow_password_change) {
                    return done(null, false);
                }
                if (admin) {
                    return done(null, {
                        id: admin._id.toString(),
                        name: admin.name,
                        email: admin.email,
                        role: admin.role
                    });
                } else {
                    return done(null, false);
                }
            } else if (payload.role === constants.USER) {
                const user = await User.findById(payload.id);
                if (user) {
                    return done(null, {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        phoneNumber: user.phone_number,
                        role: user.role
                    });
                }
            } else {
                return done(null, false);
            }
        } catch (err) {
            console.error('⚡[server][passportJwt] Error while Authenticating:', err);
            return done(err, false);
        }
    }))
};