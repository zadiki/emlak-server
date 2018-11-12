import passport from "passport";
import googleStrategy from "passport-google-oauth20";
import User from '../models/User';
import request from "request";
import {registerUserService} from "../services/UserService";


const GoogleStrategy = googleStrategy.Strategy;


export default () => {
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({
            clientID: "687371676970-74huupoo1ssbdfrqelo47671idscvvvg.apps.googleusercontent.com",
            clientSecret: "w20RQQJftTHKjw04migZoBbT",
            callbackURL: "https://emlak-1533406597315.appspot.com/google/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                User.findOne({'Google.id':profile.id},async (err,user)=>{
                    if(err){
                        return done(err);
                    }if(user){
                        return done(null,user);
                    }else{
                        var user= {
                            "Fname":"",
                            "Lname":"",
                            "ProfileName":"",
                            "Email":"",
                            "Google":{
                                "id":"",
                                "token":""
                            }
                        }
                        user.Fname=profile.name.familyName||profile.displayName||"";
                        user.Lname=profile.name.givenName|| profile.displayName||"";
                        user.ProfileName=user.Fname+" "+user.Lname;
                        user.Email=profile.emails[0].value;
                        user.Google.id=profile.id;
                        user.Google.token=accessToken;
                        user.Avatar= profile.photos?profile.photos[0].value:"/images/company/user.png";
                        var query={Email:user.Email}
                        var options = { upsert: true, new: true, setDefaultsOnInsert: true };
                        return User.findOneAndUpdate(query,user,options,(err,user)=>{
                            if(err){
                                console.log(err);
                                return done(err);

                            }else{
                                return done(null,user);
                            }
                        });
                        // let saveduser= await registerUserService(user);
                        // return done(null,saveduser);

                    }
                });

            });
        }
    ));
};