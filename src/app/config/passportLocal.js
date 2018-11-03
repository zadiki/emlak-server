import passport from "passport";
import localStrategy from "passport-local";
import User from '../models/User';
import * as Constants from "../utils/Constants";

const LocalStrategy = localStrategy.Strategy;

export default () => {
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use("local-login", new LocalStrategy({
        usernameField: 'Email',
        passwordField: 'Password',
        passReqToCallback: true
    }, (req, email, password, done) => {
        req.checkBody('Email', 'Enter valid email').notEmpty().isEmail();
        req.checkBody('Password', 'Password must be 4-15 characters').notEmpty().len(4, 15);
        var errors = req.validationErrors();
        if (errors) {
            return done(null, false, req.flash('errors', errors));
        }
        User.findOne({'Email': email}, (err, user) => {
            if (err) {
                return done(null, false, req.flash('errors', [{msg: err}]));
            }

            if (!user) {
                return done(null, false, req.flash('errors', [{msg: 'User with such email does not exist'}]));
            }
            if (!user.validPassword(password)) {
                return done(null, false, req.flash('errors', [{msg: 'Password incorrect.'}]));
            }
            if (user.AccountStatus == Constants.USER_STATUS_PENDING) {
                return done(null, false, req.flash('errors', [{msg: 'You need to confirm your email.'}]));
            }
            if (user.AccountStatus == Constants.USER_STATUS_VOIDED) {
                return done(null, false, req.flash('errors', [{msg: 'Your account has been deactivated. Please contact your HR for reactivation.'}]));
            }
            req.session.user = user;
            return done(null, user);
        });
    }));

};