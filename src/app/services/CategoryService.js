import Category from "../models/Category";

//categorytypes
export const findAllCategoryService = () => {
    return Category.find().exec();
}
export const findCategoryByIdService = () => {

}
export const findCategoryByNameService = () => {

}
export const addCategoryService = (categoryInfo) => {
    let category = new Category(categoryInfo)
    console.log(category);
    return category.save();
}
export const updateByOneCategoryService = (categoryname,saleornot) => {
    var update = {$inc: {RentCount: 1}};
    if(saleornot=="sale"){
        update = {$inc: {SaleCount: 1}};
    }
    return Category.update({Name: categoryname}, update).exec();
}

