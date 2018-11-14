import {
    findUserByIdService,
    registerUserService,
    updateUserService,
    updateUserStatusService
} from "../services/UserService";
import {findAllCategoryService} from "../services/CategoryService";
import {findAllPropertyService, findPropertyByUserIdService} from "../services/PropertyService";
import {sendEmail} from "../utils/SendEmailUtil";
import {generateErrorsArray} from "../utils/ErrorsUtil";
import * as Constants from "../utils/Constants";
import {deleteFilefromGcp, sendSingleImageToGCS, singleUploadMulter} from "../utils/GcloudImageStorage";
import {toUpperCase} from "../utils/StringManupulation";

export const login = (req, res, next) => {
    res.render("user/login");
}
export const logout = (req, res, next) => {
    req.session.destroy();
    res.redirect("/");
}
export const home = async (req, res, next) => {
    if (req.session.user && req.session.user.UserLevel == Constants.USER_LEVEL_ADMIN) {
        res.redirect("/admin");
    } else {
        //sendEmail(req.session.user,req); //for email testing purpose
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
    req.checkBody('confirmPassword', 'Confirm password do not match password').notEmpty().equals(req.body.Password.trim());
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
            ProfileName: "",
            Local: {
                Password: ""
            },
            Phone: ""
        };
        user.Fname = toUpperCase(req.body.Fname.trim());
        user.Lname = toUpperCase(req.body.Lname.trim());
        user.ProfileName = user.Fname + " " + user.Lname;
        user.Email = req.body.Email.trim();
        user.Phone = req.body.Phone.trim();
        user.Local.Password = req.body.Password.trim();

        registerUserService(user)
            .then((user) => {
                sendEmail(user, req)
                res.redirect("/");
            })
            .catch((errors) => {
                console.log("errors", errors);
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
export const userprofilePage = async (req, res, next) => {
    let categorylist = await findAllCategory();
    let propertylist = await findPropertyByUserIdService(req.session.user._id);
    let category_list = formatCategoryList(categorylist);
    propertylist.forEach((property) => {
        let index = category_list.findIndex(x => x.Name == property.Category);
        category_list[index].Count++;
    });
    res.render("user/userprofile", {
        categorylist: category_list,
        propertylist: propertylist
    });
}
export const userprofileinfoPage = async (req, res, next) => {
    let user = await findUserByIdService(req.session.user._id);
    let categorylist = await findAllCategory();
    let propertylist = await findPropertyByUserIdService(req.session.user._id);
    let category_list = formatCategoryList(categorylist);
    propertylist.forEach((property) => {
        let index = category_list.findIndex(x => x.Name == property.Category);
        category_list[index].Count++;
    });
    res.render("user/userprofile", {
        categorylist: category_list,
        userprofile: user[0]
    });
}

export const updateUsermiddleware = (req, res, next) => {
    singleUploadMulter(req, res, async function (err) {
        if (err) {
            console.log(err)

        } else {
            if (req.file) {
                let image = await sendSingleImageToGCS(req, res, next);
                if (image.length > 0) {
                    req.image_url = image;
                    deleteFilefromGcp(req.session.user.Avatar);
                }
            }
        }
        next();
    })
}
export const updateUser = async (req, res) => {
    var user = new Object();
    user["id"] = req.session.user._id;
    user["ProfileName"] = req.body.profile_name.trim();
    user["Fname"] = req.body.first_name.trim();
    user["Lname"] = req.body.last_name.trim();
    user["Phone"] = req.body.phone.trim();
    user["PublicInfo"] = req.body.public_info.trim();
    req.image_url ? user["Avatar"] = req.image_url : "";
    await updateUserService(user).then((user) => {
        req.session.user = user;
    }).catch((e) => {
        deleteFilefromGcp(user.Avatar);
        console.log(e)
    });
    res.redirect('back')
}
const formatCategoryList = (categorylist) => {
    let category_list = [];
    categorylist.forEach((category) => {
        let categoryObject = new Object();
        categoryObject["Name"] = category.Name;
        categoryObject["Count"] = 0;
        category_list.push(categoryObject);
    });
    return category_list;
}