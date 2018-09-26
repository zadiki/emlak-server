import Property from "../models/Property";
import {findAllCategoryService} from "../services/CategoryService";
import {postPropertyService, findAllPropertyService,findPropertyByIdService} from "../services/PropertyService"
import {upload} from "../utils/ImageUpload";
import  {multer,sendUploadToGCS,deleteFilefromGcp}from "../utils/GcloudImageStorage";
import {getPropertyTypeCounts} from "../utils/PropertyCountUtils";
import fs from "fs";

export const getAddPropertypage = async (req, res, next) => {

    let categorytypelist = await findAllCategoryService();
    var propertylistObject = await findAllPropertyService();
    var propertylist = propertylistObject.chunkedpropertylist
    var propertycount = getPropertyTypeCounts(propertylistObject.propertylist);
    console.log("Property count:=>",propertycount);
    res.render("property/postproperty", {
        categorytypelist: categorytypelist,
        propertylist: propertylist,
        propertycount:propertycount
    });
}
export const getPropertypage = async(req, res) => {
    let property = await findPropertyByIdService(req.params.id);
    res.render("property/property", {
        property:property
    });
}

export const addpropertymiddleware = (req, res, next) => {
    // upload(req, res, function (err) {
    //     if (err) {
    //         res.send("cannot upload the files ,please ensure you upload images,of max size 50kb");
    //     } else {
    //         let imageurls = [];
    //         req.files.forEach((image) => {
    //             imageurls.push("property/" + image.filename);
    //         });
    //         req.imageurls = imageurls;
    //         next();
    //     }
    // });
    multer(req,res,async function (err) {
        if(err){
            console.log(err)
        }else{
            let image = await sendUploadToGCS(req,res,next);
            image.length>0 ? req.image_urls=image:req.image_urls="";
        }
        next();
    })
}


export const addproperty = async (req, res) => {
    var property = new Property();
    property.PostedBy = req.session.user._id;
    property.ImageUrl = req.image_urls;
    req.checkBody('property', 'Property category must be entered e.g a house').notEmpty();
    req.checkBody('description', 'Please provide description for your property').notEmpty();
    req.checkBody('sale_or_rent', 'Please state if it for sale or rental').notEmpty();
    req.checkBody('price', 'pleace give the price').notEmpty();
    req.checkBody('paymentmode', 'Please select a payment mode').notEmpty();
    req.checkBody('address', 'please ensure you give the right address');
    req.checkBody('latitude', 'please ensure you give the right address').notEmpty().len(4, 15);
    req.checkBody('longitude', 'please ensure you give the right address').notEmpty().len(4, 15);

    var errors = req.validationErrors();
    if (errors) {
        for (var i = 0; i < property.ImageUrl.length; i++) {
            var imagepath = property.ImageUrl[i];
            try {
                deleteFilefromGcp(imagepath);
            } catch (errors) {
                console.log(errors)
            }
        }
        res.send(errors);
    }
    else {
        property.Category = req.body.property;
        property.SaleOrNot = req.body.sale_or_not;
        property.PaymentMode = req.body.paymentmode;
        property.Address = req.body.address;
        property.Price = req.body.price;
        property.Description = req.body.description;
        property.Location.coordinates = [req.body.latitude, req.body.longitude];
        await postPropertyService(property);

        res.redirect("back");
    }

}
