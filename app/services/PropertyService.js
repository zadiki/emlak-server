import Property from "../models/Property";
export  const findAllPropertyService= async()=>{
    let propertylist= await Property.find();
    console.log(propertylist);
    return propertylist;
}

export const postPropertyService=(property)=>{
    return property.save();
}