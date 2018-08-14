import {findAllCategoryTypeService} from "../services/CategoryService";
import {upload} from "../utils/ImageUpload";
export const getAddPropertypage=async (req,res,next)=>{

    let categorytypelist = await findAllCategoryTypeService();
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
export const  getPropertypage=(req,res)=>{
    // res.send(req.params.id);
    res.render("property/property",{});
}

export const addproperty=(req,res,next)=>{
    upload(req, res, function (err) {
        if (err) {

            res.send("cannot upload the files ,please ensure you upload images,of max size 50kb");
        } else {
            console.log(req.files);
            res.send(req.body);
        }
    });
}

