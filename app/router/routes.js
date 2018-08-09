import passport from "passport";
import {upload} from "../utils/ImageUpload";
import * as userController from "../controllers/UserControlller";
import * as categoryController from "../controllers/CategoryController";
import  * as propertyController from "../controllers/PropertyController";

export default (app) => {

    app.route("/")
        .get(userController.home);
    app.route("/home")
        .get(userController.home);


    app.route("/login")
        .get(userController.login)
        .post(passport.authenticate("local-login", {
            successRedirect: '/home',
            failureRedirect: '/login',
            failureFlash: true
        }));

    app.route("/signup")
        .get(userController.signupPage)
        .post(userController.signupUser);
    app.route("/logout")
        .get(userController.logout);

    app.route("/emailconfirmation/:id")
        .get(userController.confirmEmail);

    app.route("/admin")
        .get(userController.adminPage);

    app.route("/propertytype")
        .post(categoryController.addCategoryType);
    app.route("/propertycategory")
        .post(categoryController.addCategory);
    app.route("/postanAdvert")
        .get(propertyController.getAddPropertypage);
    app.route("/property/:id")
        .get(propertyController.getPropertypage);

    app.route("/file")
        .get(function (req, res, next) {
            res.render("imageupload");
        })
        .post(function (req, res) {
        upload(req, res, function (err) {
            if (err) {
                console.log(err);
                res.send("success");
            } else {
                console.log(req.file);
                res.send("wow");
            }
        });
    });


}