import Property from "../models/Property";
export  const findAllPropertyService= async()=>{
    let propertylist= await Property.find();
    var chunkedpropertylist=[];
    var chunksize=12;
    for(var i=0;i<propertylist.length; i=+chunksize){
        chunkedpropertylist.push(propertylist.slice(i,i+chunksize));
    }
    return chunkedpropertylist;
}
export const findPropertyByIdService= (id)=>{
    return Property.findById(id).populate('PostedBy').exec();
}

export const postPropertyService=(property)=>{
    return property.save();
}