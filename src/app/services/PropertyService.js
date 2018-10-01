import Property from "../models/Property";
export  const findAllPropertyService= async()=>{
    let propertylist= await Property.find();
    return chunckedPropertyList(propertylist);
}
export const findPropertyByIdService= (id)=>{
    return Property.findById(id).populate('PostedBy').exec();
}

export const postPropertyService=(property)=>{
    return property.save();
}

export const findAllByCategoryService=async(category)=>{
    let propertylist= await Property.find({"Category":{ $regex: '.*' + category + '.*' } });
    return chunckedPropertyList(propertylist);
}

const chunckedPropertyList=(propertylist)=>{
    var chunkedpropertylist=[];
    var chunksize=12;
    for(var i=0;i<propertylist.length; i=+chunksize){
        chunkedpropertylist.push(propertylist.slice(i,i+chunksize));
    }
    return chunkedpropertylist;
}