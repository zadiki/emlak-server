
import CategoryType from "../models/Category";

//categorytypes
export  const findAllCategoryService=()=>{
    return CategoryType.find().exec();
}
export  const findCategoryByIdService=()=>{

}
export const addCategoryService = (categorytypeInfo)=>{
    let categorytype = new CategoryType(categorytypeInfo)
    console.log(categorytype);
    return categorytype.save();
}




