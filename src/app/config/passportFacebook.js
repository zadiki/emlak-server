import passport from "passport";
import facebookStrategy from "passport-facebook";
import User from '../models/User';
import request from "request";
import {registerUserService} from "../services/UserService";


const FacebookStrategy = facebookStrategy.Strategy;


export default () => {
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
            clientID: 319422762120874,
            clientSecret: "57a66bdbc5192c8b98ee0abe588c8799",
            callbackURL: "https://emlak-1533406597315.appspot.com/auth/facebook/callback",
            profileFields: ['id', 'emails', 'name','photos']
        },
        function(accessToken, refreshToken, profile, done) {
        // console.log("profile",profile)
          process.nextTick(function () {
              User.findOne({'Facebook.id':profile.id},async (err,user)=>{
                  if(err){
                      // console.log(err);
                      return done(err);
                  }if(user){
                      return done(null,user);
                  }else{
                      var user= {
                          "Fname":"",
                          "Lname":"",
                          "Email":"",
                          "Facebook":{
                              "id":"",
                              "token":""
                          }
                      }
                      user.Fname=profile.name.familyName;
                      user.Lname=profile.name.givenName+" "+profile.name.middleName;
                      user.Email=profile.emails[0].value|| "";
                      user.Facebook.id=profile.id;
                      user.Facebook.token=accessToken;
                      user.Avatar= profile.photos?profile.photos[0].value:"/images/company/user.png";

                      let saveduser= await registerUserService(user);
                      return done(null,saveduser);

                  }
              });

          });
        }
    ));
};