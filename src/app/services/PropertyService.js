import Property from "../models/Property";
export  const findAllPropertyService= async()=>{
    let propertylist= await Property.find();
    return chunckedPropertyList(propertylist);
}
export const findPropertyByIdService= async(id)=>{
    await updatePropertyViewservice(id);
    return Property.findById(id).populate('PostedBy').exec();
}
export const updatePropertyViewservice=(id)=>{
    var update = { $inc: { views: 1 }};
    return Property.update({_id:id},update).exec();
}
export const findPropertyByUserIdService= (id)=>{
    return Property.find({"PostedBy":id}).sort({createdAt: -1}).exec();
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