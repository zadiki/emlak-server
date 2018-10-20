import {registerUserService, updateUserStatusService} from "../services/UserService";
import {findAllCategoryService} from "../services/CategoryService";
import {findAllPropertyService,findPropertyByUserIdService} from "../services/PropertyService";
import {sendEmail} from "../utils/SendEmailUtil";
import {generateErrorsArray} from "../utils/ErrorsUtil";
import  * as Constants  from "../utils/Constants";
import {toUpperCase} from "../utils/StringManupulation";

export const login = (req, res, next) => {
    res.render("user/login");
}
export const logout =(req,res,next)=>{
    req.session.destroy();
    res.redirect("/");
}
export const home = async (req, res, next) => {
    if (req.session.user && req.session.user.UserLevel == Constants.USER_LEVEL_ADMIN) {
        res.redirect("/admin");
    } else {
        let categorylist = await findAllCategory();
        var propertylist = await findAllPropertyService();
        res.render("user/guest", {
            categorylist: categorylist,
            propertylist: propertylist
        });
    }
}
export const adminPage = async (req, res, next) => {
    if (!req.session.user || req.session.user.UserLevel != 5) {
        res.redirect("/");
    } else {
        let categorylist = await findAllCategory();
        var propertylist = await findAllPropertyService();
        res.render("user/admin", {
            propertylist: propertylist,
            categorylist: categorylist
        });
    }
}
export const signupPage = (req, res, next) => {
    res.render("user/signup");
}
export const signupUser = (req, res, next) => {
    req.checkBody('Fname', 'Enter valid first name').notEmpty();
    req.checkBody('Lname', 'Enter valid last name').notEmpty();
    req.checkBody('Phone', 'Enter valid Phone').notEmpty();
    req.checkBody('Email', 'Enter valid email').notEmpty().isEmail();
    req.checkBody('Password', 'Password must be 4-15 characters').notEmpty().len(4, 15);
    req.checkBody('confirmPassword', 'Confirm password do not match password').notEmpty().equals(req.body.Password);
    var errors = req.validationErrors();
    req.flash("formBody", req.body);

    if (errors) {
        req.flash('errors', errors);
        res.redirect("/signup");
    } else {
        var user = {
            Fname: "",
            Lname: "",
            Email: "",
            Password: "",
            Phone: ""
        };
        user.Fname = toUpperCase(req.body.Fname);
        user.Lname = toUpperCase(req.body.Lname);
        user.Email = req.body.Email;
        user.Phone = req.body.Phone;
        user.Password = req.body.Password;

        registerUserService(user)
            .then((user) => {
                sendEmail(user, req)
                res.redirect("/");
            })
            .catch((errors) => {
                let errors_array = generateErrorsArray(errors.errors);
                req.flash("errors", errors_array);
                res.redirect("/signup");
            });
    }
}
export const findAllCategory = async () => {
    let categorylist = await findAllCategoryService();
    return categorylist;
}
export const confirmEmail = (req, res, next) => {
    updateUserStatusService(req.params.id);
    res.redirect("/home");
}
export const userprofilePage=async (req,res,next)=>{
    let categorylist=await findAllCategory();
    let propertylist =await findPropertyByUserIdService(req.session.user._id);
    let category_list= [];
    categorylist.forEach((category)=>{
      let categoryObject = new Object();
        categoryObject["Name"]=category.Name;
        categoryObject["Count"]=0;
        category_list.push(categoryObject);
    });
    propertylist.forEach((property)=>{
        let index = category_list.findIndex(x=>x.Name==property.Category);
        category_list[index].Count++;
    });
    res.render("user/userprofile",{
        categorylist: category_list,
        propertylist:propertylist
        });
}