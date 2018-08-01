import Category from "../models/Category";
import CategoryType from "../models/CategoryType";

//categorytypes
export  const findAllCategoryTypeService=()=>{
    return CategoryType.find().exec();
}
export  const findCategoryTypeByIdService=()=>{

}
export const addCategoryTypeService = (categorytypeInfo)=>{
    let categorytype = new CategoryType(categorytypeInfo)
    console.log(categorytype);
    return categorytype.save();
}

//category
export  const findAllCategoryService=()=>{
    return Category.find().exec();
}
export  const findCategoryByIdService=()=>{

}
export const addCategoryService = (categoryInfo)=>{
    let category = new Category(categoryInfo)
    return category.save();
}


