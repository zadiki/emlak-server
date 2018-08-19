import {findAllCategoryService} from "../services/CategoryService";
import {upload} from "../utils/ImageUpload";

export const getAddPropertypage = async (req, res, next) => {

    let categorytypelist = await findAllCategoryService();
    var propertylist = [];
    var propertys = ["zadiki", "hassan", "zadiki", "hassan", "zadiki", "hassan", "zadiki", "hassan", "zadiki", "hassan", "zadiki", "hassan"];
    propertylist.push(propertys);
    propertylist.push(propertys);
    propertylist.push(propertys);
    // console.log(propertylist);
    res.render("property/postproperty", {
        categorytypelist: categorytypelist,
        propertylist: propertylist
    });
}
export const getPropertypage = (req, res) => {
    // res.send(req.params.id);
    res.render("property/property", {});
}

export const addpropertymiddleware = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            res.send("cannot upload the files ,please ensure you upload images,of max size 50kb");
        } else {
            let imageurls = [];
            req.files.forEach((image) => {
                imageurls.push("upload/" + image.filename);
            });
            req.imageurls = imageurls;
            next();
        }
    });
}

export const addproperty = async (req, res) => {

    req.checkBody('Category', 'Property category must be entered e.g a house').notEmpty();
    req.checkBody('Description', 'Please provide description for your property').notEmpty();
    req.checkBody('SaleOrNot', 'Please state if it for sale or rental').notEmpty();
    req.checkBody('Price', 'pleace give the price').notEmpty();
    req.checkBody('PaymentMode', 'Please select a payment mode').notEmpty();

    req.checkBody('Address', 'please ensure you give the right address').notEmpty().len(4, 15);
    req.checkBody('bathroom', 'Password must be 4-15 characters').notEmpty();
    req.checkBody('furnished', 'Password must be 4-15 characters').notEmpty();
    req.checkBody('parking', 'Password must be 4-15 characters').notEmpty();
    req.checkBody('water', 'Password must be 4-15 characters').notEmpty();
    req.checkBody('floor', 'Password must be 4-15 characters').notEmpty();
    req.checkBody('description', 'Password must be 4-15 characters').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
    } else {
        res.send("wow");
    }

}

