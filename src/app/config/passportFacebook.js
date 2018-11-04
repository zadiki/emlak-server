import passport from "passport";
import facebookStrategy from "passport-facebook";
import User from '../models/User';
import * as Constants from "../utils/Constants";


const FacebookStrategy = facebookStrategy.Strategy;


export default () => {
    passport.serializeUser(function(user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function(obj, cb) {
        cb(null, obj);
    });

    passport.use(new FacebookStrategy({
            clientID: 290449878232420,
            clientSecret: "b79f7e92cc5252ec748c4e447e3a51f2",
            callbackURL: "http://localhost:3000/auth/facebook/callback",
            profileFields: ['id', 'emails', 'name','photos']
        },
        function(accessToken, refreshToken, profile, cb) {
        console.log("profile",profile)
          process.nextTick(function () {
              User.findOne({'Facebook.id':profile.id},(err,user)=>{
                  if(err){
                      console.log(err);
                      return done(err);
                  }if(user){
                      console.log(user);
                      return done(null,user);
                  }else{
                     console.log(' no user found')
                  }
              });

          });
        }
    ));
};