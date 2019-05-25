import Property from "../models/Property";
import {findAllCategoryService, updateByOneCategoryService} from "../services/CategoryService";
import {findUserByIdService} from "../services/UserService";
import {
    findAllByCategoryService,
    findAllPropertyService,
    findByqueryService,
    findPropertyByIdService,
    findPropertyWithIdService,
    postPropertyService,
    propertySearchService,
    updatePropertyService
} from "../services/PropertyService";
import {
    deleteFilefromGcp,
    multipleUploadMulter,
    sendMultipleImagesToGCS,
    sendSingleImageToGCS,
    singleUploadMulter
} from "../utils/GcloudImageStorage";
import {differenceOf2StringArrays} from "../utils/StringManupulation";

export const allProperties = async (req, res, next) => {
    let categorylist = await findAllCategory();
    var propertylist = await findAllPropertyService();
    res.json({
        categorylist: categorylist,
        propertylist: propertylist
    });

}
export const getPropertypage = async (req, res) => {
    let property = await findPropertyByIdService(req.params.id);
    console.log("Param: ",req.params.id);

    if(property != null){
        if(property['PostedBy'] == null){
            console.log("Property null: ",property);
            property['PostedBy'] = {
                _id: 1,
                Avatar: 'notfound',
                ProfileName: 'user not found',
                Phone: ''
            }
        }else{
                property['PostedBy'].Local=undefined;
                property['PostedBy'].Facebook=undefined;
                property['PostedBy'].Google=undefined;
        }
        res.json(property);
    }else{
        res.status(500);
    }

}
export const addpropertymiddleware = (req, res, next) => {
    multipleUploadMulter(req, res, async function (err) {
        if (err) {
            console.log(err)

        } else {
            if (req.files[0]) {
                let image = await sendMultipleImagesToGCS(req, res, next);
                image.length > 0 ? req.image_urls = image : req.image_urls = "";
            }
        }
        next();
    })
}
export const addproperty = async (req, res) => {
    var property = new Property();
    property.PostedBy = req.user.id;
    property.ImageUrl = req.image_urls ? req.image_urls : "/images/company/logo.jpg";
    req.checkBody('property', 'Property category must be entered e.g a house').notEmpty();
    req.checkBody('description', 'Please provide description for your property').notEmpty();
    req.checkBody('sale_or_rent', 'Please state if it for sale or rental').notEmpty();
    req.checkBody('price', 'pleace give the price').notEmpty();
    req.checkBody('paymentmode', 'Please select a payment mode').notEmpty();
    req.checkBody('address', 'please ensure you give the right address');
    req.checkBody('latitude', 'please ensure you give the right address').notEmpty().len(4, 30);
    req.checkBody('longitude', 'please ensure you give the right address').notEmpty().len(4, 30);

    var errors = req.validationErrors();
    if (errors) {
        if (req.image_urls) {
            for (var i = 0; i < property.ImageUrl.length; i++) {
                var imagepath = property.ImageUrl[i];
                try {
                    deleteFilefromGcp(imagepath);
                } catch (errors) {
                    console.log("trying to delete error", errors);
                }
            }
        }
       res.status(401).json(errors);
    }
    else {
        property.Category = req.body.property.trim();
        property.SaleOrNot = req.body.sale_or_rent.trim();
        property.PaymentMode = req.body.paymentmode.trim();
        let addr_arr = req.body.address.trim().split(" ");
        let add_subst_arr = [];
        addr_arr.forEach((addr) => {
            if (addr.trim() == "KE") {
                add_subst_arr.push("Kenya")
            } else {
                add_subst_arr.push(addr);
            }
        });
        property.Address = add_subst_arr.join(" ");
        property.Price = req.body.price.trim();
        property.Description = req.body.description.trim();
        property.Location.coordinates = [req.body.latitude.trim(), req.body.longitude.trim()];
        await postPropertyService(property);
        updateByOneCategoryService(property.Category.trim(),property.SaleOrNot);
        res.json({});
    }

}
export const updateproperty = async (req, res) => {

    let id = req.body.property_id.trim();
    let lat = req.body.latitude.trim();
    let lng = req.body.longitude.trim();
    let propertyobj = new Object();
    propertyobj["Category"] = req.body.property_type.trim();
    propertyobj["Price"] = req.body.property_price.trim();
    propertyobj["points"] = req.body.property_points.trim();
    propertyobj["Address"] = req.body.property_address.trim();
    propertyobj["Description"] = req.body.description.trim();
    propertyobj["Location.coordinates"] = [lat, lng];
    if (req.body.property_paymentmode.trim() == "sale") {
        propertyobj["PaymentMode"] = "";
        propertyobj["SaleOrNot"] = "sale";
    } else {
        propertyobj["PaymentMode"] = req.body.property_paymentmode.trim();
        propertyobj["SaleOrNot"] = "rent";
    }

    await updatePropertyService(id, propertyobj);
    let user = await findUserByIdService(req.user.id);
    req.user = user[0];
    res.json({});
}
export const propertyBycategoryPage = async (req, res, next) => {
    let categorylist = await findAllCategoryService();
    var propertylist = await findAllByCategoryService(req.params.category,req.query.filter);
    res.json({
        categorylist: categorylist,
        propertylist: propertylist
    });
}
export const propertySearch = async (req, res, next) => {
    let categorylist = await findAllCategoryService();
    let search_array = req.body.search_text.trim().split(" ");
    var propertylist = await propertySearchService(search_array);
    res.json({
        categorylist: categorylist,
        propertylist: propertylist
    });
}
export const propertyByQueryPage = async (req, res, next) => {
    let queryObj = new Object();
    queryObj["Category"] = req.query.category.trim();
    queryObj["location"] = Array.isArray(req.query.location) ? req.query.location : new Array(req.query.location);
    queryObj["propertytype"] = req.query.propertytype;
    queryObj["renttype"] = req.query.renttype;

    let propertylist = await findByqueryService(queryObj);
    let categorylist = await findAllCategoryService();
    res.json({
        categorylist: categorylist,
        propertylist: propertylist
    });
}
export const deletepropertyImage = async (req, res, next) => {
    deleteFilefromGcp(req.body.imageurl.trim()).then(function (success) {
        console.log("image successfully deleted")
    }).catch(e => console.log("error deleting images"));
    var users = [{
        id: req.body.propertyid,
        images: [req.body.imageurl]
    }];
    let property = await findPropertyByIdService(req.body.propertyid.trim());
    let netimageurl = differenceOf2StringArrays(users[0].images, property.ImageUrl);
    netimageurl.length > 0 ? "" : netimageurl = ["images/company/logo.jpg"];
    users[0].images = netimageurl;
    var images = {"ImageUrl": netimageurl}
    await updatePropertyService(users[0].id.trim(), images);
    res.json(users);
}
export const updatepropertyImageMiddleware = async (req, res, next) => {
    await singleUploadMulter(req, res, async function (err) {
        if (err) {
            console.log(err)

        } else {
            if (req.file) {
                let image = await sendSingleImageToGCS(req, res, next);
                if (image.length > 0) {
                    req.image_url = image;

                }
            }
        }
        next();
    });

}
export const updatepropertyImage = (req, res) => {
    let id = req.body.property_id.trim();
    var users = [{
        id: id,
        images: [req.image_url]
    }];
    var updatedImageurl = new Object();
    findPropertyWithIdService(id)
        .then((property) => {
            var images = property.ImageUrl;
            images.push(req.image_url);
            users[0].images = images;
            updatedImageurl["ImageUrl"] = images;
            updatePropertyService(id, updatedImageurl);
            res.json(users);
        })
        .catch(() => {
            res.json(users);
        });

}

export const findAllCategory = async () => {
    let categorylist = await findAllCategoryService();
    return categorylist;
}