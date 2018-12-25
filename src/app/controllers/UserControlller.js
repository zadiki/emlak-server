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
import {deleteFilefromGcp, sendSingleImageToGCS, singleUploadMulter} from "../utils/GcloudImageStorage";
import {toUpperCase} from "../utils/StringManupulation";
import jwt from "jsonwebtoken";


export const signupUser = (req, res, next) => {
    req.checkBody('Fname', 'Enter valid first name').notEmpty();
    req.checkBody('Lname', 'Enter valid last name').notEmpty();
    req.checkBody('Phone', 'Enter valid Phone').notEmpty();
    req.checkBody('Email', 'Enter valid email').notEmpty().isEmail();
    req.checkBody('Password', 'Password must be 4-15 characters').notEmpty().len(4, 15);
    req.checkBody('confirmPassword', 'Confirm password do not match password').notEmpty().equals(req.body.Password.trim());
    var errors = req.validationErrors();

    if (errors) {
        res.status(500).json(errors);
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
                let jwttoken = jwt.sign({
                    id: user._id,
                    exp: parseInt(((new Date()).getTime() / 1000) + (48*60 * 60)),
                }, process.env.JWT_SECRET_KEY);

                let url = `${process.env.CLIENT_HOST}/emailconfirmation/${jwttoken}`;
                sendEmail(user, req)
                res.json({"msg": `activation email has been sent to ${user.Email}`});
            })
            .catch((errors) => {

                let errors_array = generateErrorsArray(errors.errors);

                res.status(401).json(errors);
            });
    }
}
export const findAllCategory = async () => {
    let categorylist = await findAllCategoryService();
    return categorylist;
}
export const confirmEmail = (req, res, next) => {
    let token = req.body.token;
    //decode the above token
    updateUserStatusService(id);
    res.json({"msg": "successfully confirmed"});
}
export const getUserinfo = async (req,res)=>{
    let userarray = await findUserByIdService(req.user.id);
    let user=userarray[0];
    let userData =new Object();
    userData["email"]=user.Email;
    userData["image"]=user.Avatar;
    userData["profilename"]=user.ProfileName;
    userData["phone"]=user.Phone;
    userData["points"]=user.Points;
    return res.status(200).json(userData);
}
export const userprofile = async (req, res, next) => {
    let categorylist = await findAllCategory();
    let propertylist = await findPropertyByUserIdService(req.user.id);
    let category_list = formatCategoryList(categorylist);
    propertylist.forEach((property) => {
        let index = category_list.findIndex(x => x.Name == property.Category);
        category_list[index].Count++;
    });
    res.json({
        categorylist: category_list,
        propertylist: propertylist
    });
}
export const userprofileinfoPage = async (req, res, next) => {
    let user = await findUserByIdService(req.user.id);
    let categorylist = await findAllCategory();
    let propertylist = await findPropertyByUserIdService(req.user.id);
    let category_list = formatCategoryList(categorylist);
    propertylist.forEach((property) => {
        let index = category_list.findIndex(x => x.Name == property.Category);
        category_list[index].Count++;
    });
    res.json({
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
                    deleteFilefromGcp(req.user.Avatar);
                }
            }
        }
        next();
    })
}
export const updateUser = async (req, res) => {
    var user = new Object();
    user["id"] = req.user.id;
    user["ProfileName"] = req.body.profile_name.trim();
    user["Fname"] = req.body.first_name.trim();
    user["Lname"] = req.body.last_name.trim();
    user["Phone"] = req.body.phone.trim();
    user["PublicInfo"] = req.body.public_info.trim();
    req.image_url ? user["Avatar"] = req.image_url : "";
    await updateUserService(user).then((user) => {
        req.user = user;
    }).catch((e) => {
        deleteFilefromGcp(user.Avatar);
        console.log(e)
    });
    res.json(user);
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