const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./db').users;
const { secret } = require('./config/jwtConfig');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: secret,
};

passport.use(
    'jwt',
    new JWTstrategy(opts, (jwt_payload, done) => {
        try {
            User.findById(jwt_payload.id)
                .then(user => {
                    if (user) {
                        console.log('user found in db in passport');
                        done(null, user);
                    } else {
                        console.log('user not found in db');
                        done(null, false);
                    }
                });
        } catch (err) {
            done(err);
        }
    }),
);

module.exports = passport;