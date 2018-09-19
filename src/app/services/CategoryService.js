
import Category from "../models/Category";

//categorytypes
export  const findAllCategoryService=()=>{
    return Category.find().exec();
}
export  const findCategoryByIdService=()=>{

}
export const addCategoryService = (categoryInfo)=>{
    let category = new Category(categoryInfo)
    console.log(category);
    return category.save();
}
