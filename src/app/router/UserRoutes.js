import express from "express";
import passport from "passport";

import * as userController from "../controllers/UserControlller";
import jwtverifymidleware from "./TokenVerificationMiddleware"


const router = express.Router();

router.post("/login", function (req,res,next) {
    passport.authenticate("local-login",function (err,user,info) {
        if(err){
            return res.status(401).send("cant login now")
        }
        if(!user){
            return res.status(402).send("such user does not exist")
        }
        req.logIn(user, { session: false }, function (err) {
            let token= user.toAuthJSON().token;
            let userData =new Object();
            userData["email"]=user.Email;
            userData["image"]=user.Avatar;
            userData["profilename"]=user.ProfileName;
            userData["phone"]=user.Phone;
            userData["points"]=user.Points;
            userData["token"]=token;
            return res.status(200).json(userData);
        });

    })(req,res,next);
});

router.get('/getuserdata',jwtverifymidleware,userController.getUserinfo);
router.post("/signup",userController.signupUser);
router.post("/emailconfirmation",userController.confirmEmail);
router.get("/userprofile",jwtverifymidleware, userController.userprofile);
router.get("/userprofile/userinfo",jwtverifymidleware, userController.userprofileinfoPage);
router.post("/userprofile/userinfo",jwtverifymidleware, userController.updateUsermiddleware, userController.updateUser);

export default router;
