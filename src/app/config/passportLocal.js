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
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, done) => {
        req.checkBody('email', 'Enter valid email').notEmpty().isEmail();
        req.checkBody('password', 'Password must be 4-15 characters').notEmpty().len(4, 15);
        var errors = req.validationErrors();

        if (errors) {
            console.log(errors)
            return done(null, false, {'errors':[ errors]});
        }
        User.findOne({'Email': email}, (err, user) => {
            if (err) {
                console.log("error1",err);
                return done(err, false, {'errors':[{msg: err}]});
            }

            if (!user) {

                return done(null, false, {'errors':[{msg: 'User with such email does not exist'}]});
            }

            if (!user.validPassword(password)) {
                return done(null, false, {'errors':[{msg: 'Password incorrect.'}]});
            }
            if (user.AccountStatus == Constants.USER_STATUS_PENDING) {
                return done(null, false, {'errors': [{msg: 'You need to confirm your email.'}]});
            }
            if (user.AccountStatus == Constants.USER_STATUS_VOIDED) {
                return done(null, false, {'errors': [{msg: 'Your account has been deactivated. Please conact Emlak.com for reactivation.'}]});
            }

            return done(null, user);
        });
    }));

};