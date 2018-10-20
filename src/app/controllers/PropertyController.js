import Property from "../models/Property";
import {findAllCategoryService,updateCategoryService} from "../services/CategoryService";
import {postPropertyService,updatePropertyService, findAllPropertyService,findPropertyByIdService,findAllByCategoryService,propertySearchService,findByqueryService} from "../services/PropertyService"
import {upload} from "../utils/ImageUpload";
import  {multer,sendUploadToGCS,deleteFilefromGcp}from "../utils/GcloudImageStorage";

export const getAddPropertypage = async (req, res, next) => {

    let categorylist = await findAllCategoryService();
    var propertylist = await findAllPropertyService();

    res.render("property/postproperty", {
        categorylist: categorylist,
        propertylist: propertylist
    });
}
export const getPropertypage = async(req, res) => {
    let property = await findPropertyByIdService(req.params.id);
    res.render("property/property", {
        property:property
    });
}

export const addpropertymiddleware = (req, res, next) => {
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
    req.checkBody('latitude', 'please ensure you give the right address').notEmpty().len(4, 30);
    req.checkBody('longitude', 'please ensure you give the right address').notEmpty().len(4, 30);

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
        updateCategoryService(property.Category.trim());
        property.SaleOrNot = req.body.sale_or_rent;
        property.PaymentMode = req.body.paymentmode;
        let addr_arr=req.body.address.split(" ");
        let add_subst_arr=[];
        addr_arr.forEach((addr)=>{
           if(addr=="KE") {
               add_subst_arr.push("Kenya")
           }else {
               add_subst_arr.push(addr);
           }
        });
        property.Address =add_subst_arr.join(" ");
        property.Price = req.body.price.trim();
        property.Description = req.body.description.trim();
        property.Location.coordinates = [req.body.latitude, req.body.longitude];
        await postPropertyService(property);

        res.redirect("back");
    }

}
export const updateproperty=async(req,res)=>{
    let id = req.body.property_id
    let propertyobj= new Object();
    propertyobj["Category"]   =req.body.property_type.trim();
    propertyobj["Price"]      =req.body.property_price.trim();
    propertyobj["points"]     =req.body.property_points.trim();
    propertyobj["Address"]    =req.body.property_address.trim();
    propertyobj["Description"]=req.body.description.trim();
    if(req.body.property_paymentmode=="sale"){
        propertyobj["PaymentMode"]="";
        propertyobj["SaleOrNot"]="sale";
    }else{
        propertyobj["PaymentMode"]=req.body.property_paymentmode.trim();
        propertyobj["SaleOrNot"]="rent";
    }

    await updatePropertyService(id,propertyobj);
    console.log(req.body);
    res.redirect('back');
}
export const propertyBycategoryPage = async (req, res, next) => {
    let categorylist = await findAllCategoryService();
    var propertylist = await findAllByCategoryService(req.params.category);
    res.render("user/guest", {
        categorylist: categorylist,
        propertylist: propertylist
    });
}

export const propertySearch = async (req, res, next) => {
    let categorylist = await findAllCategoryService();
    let search_array=req.body.search_text.split(" ");
    var propertylist = await propertySearchService(search_array);
    res.render("user/guest", {
        categorylist: categorylist,
        propertylist: propertylist
    });
}
export const propertyByQueryPage = async (req, res, next) => {
    let queryObj = new Object();
    queryObj["Category"]=req.query.category.trim();
    queryObj["location"]=Array.isArray(req.query.location)?req.query.location:new Array(req.query.location);
    queryObj["propertytype"]=req.query.propertytype;
    queryObj["renttype"]=req.query.renttype;

    let propertylist= await findByqueryService(queryObj);
    let categorylist = await findAllCategoryService();
    res.render("user/guest", {
        categorylist: categorylist,
        propertylist: propertylist
    });
}
