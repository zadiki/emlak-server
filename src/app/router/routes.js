import passport from "passport";
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
        .get(propertyController.getAddPropertypage)
        .post(propertyController.addpropertymiddleware,propertyController.addproperty);
    app.route("/propertydetails/:id")
        .get(propertyController.getPropertypage);
    app.route("/imageuploadtest")
        .get((req,res)=>{res.render("imageupload")})
        .post(propertyController.addpropertymiddleware,function (req,res) {
            var image_urls= req.image_urls;
            res.send(image_urls)
        });
    app.route("/propertycategory/:category")
        .get(function (req,res) {
            res.send(req.params.category);
        });

}