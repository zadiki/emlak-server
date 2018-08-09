import {findAllCategoryTypeService} from "../services/CategoryService";
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
