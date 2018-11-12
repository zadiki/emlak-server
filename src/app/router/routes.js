import passport from "passport";
import * as userController from "../controllers/UserControlller";
import * as categoryController from "../controllers/CategoryController";
import * as propertyController from "../controllers/PropertyController";

export default (app) => {

    app.get('/auth/facebook',
        passport.authenticate('facebook',{scope:['email','public_profile']}));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function(req, res) {
            req.session.user=req.user
            res.redirect('/');
        });

    app.get('/auth/google',
        passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login','profile','email']}));
    app.get('/google/callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function(req, res) {
            req.session.user=req.user
            res.redirect('/');
        });

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
        .post(propertyController.addpropertymiddleware, propertyController.addproperty);

    app.route("/propertydetails/:id")
        .get(propertyController.getPropertypage);

    app.route("/imageuploadtest")
        .get((req, res) => {
            res.render("imageupload")
        })
        .post(propertyController.addpropertymiddleware, function (req, res) {
            var image_urls = req.image_urls;
            res.send(image_urls)
        });

    app.route("/propertycategory/:category")
        .get(propertyController.propertyBycategoryPage);
    app.route("/userprofile")
        .get(userController.userprofilePage);
    app.route("/userprofile/userinfo")
        .get(userController.userprofileinfoPage)
        .post(userController.updateUsermiddleware, userController.updateUser);

    app.route("/property-search")
        .get(propertyController.propertyByQueryPage)
        .post(propertyController.propertySearch);
    app.route("/test")
        .get(function (req, res) {
            res.render("test");
        });
    app.route("/propertyupdate")
        .post(propertyController.updateproperty);
}
