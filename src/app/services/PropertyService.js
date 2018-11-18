import Property from "../models/Property";
import {arrayChunk} from "../utils/StringManupulation";

export const findAllPropertyService = async () => {
    let propertylist = await Property.find().sort({points: -1}).exec();
    return arrayChunk(propertylist, 12);
}
export const findPropertyByIdService = async (id) => {
    await updatePropertyViewservice(id);
    return Property.findById(id).populate('PostedBy').exec();
}
export const findPropertyWithIdService = async (id) => {
    return Property.findById(id).exec();
}
export const updatePropertyViewservice = (id) => {
    var update = {$inc: {views: 1}};
    return Property.update({_id: id}, update).exec();
}
export const findPropertyByUserIdService = (id) => {
    return Property.find({"PostedBy": id}).sort({createdAt: -1}).exec();
}
export const propertySearchService = async (search) => {
    console.log("property search array ", search);
    let regex = search.join("|");
    let property_list = await Property.find({
        $or: [
            {
                "Address": {
                    "$regex": regex,
                    "$options": "i"
                }
            },
            {
                "Description": {
                    "$regex": regex,
                    "$options": "i"
                }
            },
            {
                "Category": {
                    "$regex": regex,
                    "$options": "i"
                }
            }
        ]
    }).sort({"points": -1}).exec();
    return arrayChunk(property_list, 12);
}
export const findByqueryService = async (queryObj) => {
    let location_regex = queryObj.location.join("|");
    console.log(location_regex)
    let category = queryObj.Category;
    let propertytype = queryObj.propertytype;
    let renttype = queryObj.renttype;
    let propert_list = await Property.find({
        $and: [
            {
                "Address": {
                    "$regex": location_regex,
                    "$options": "i"
                }
            },
            {
                "Category": {
                    $regex: '.*' + category + '.*',
                    "$options": "i"
                }
            },
            {
                "SaleOrNot": {
                    $regex: '.*' + propertytype + '.*',
                    "$options": "i"
                }
            },
            {
                "PaymentMode": {
                    $regex: '.*' + renttype + '.*'
                }
            }

        ]
    }).sort({"points": -1}).exec();
    return arrayChunk(propert_list, 12);
}
export const postPropertyService = (property) => {
    return property.save();
}
export const findAllByCategoryService = async (category, query) => {
    console.log("query string ", query);
    let propertylist = await Property.find({
        $and: [{
            "Category": {
                $regex: '.*' + category + '.*',
                "$options": "i"
            }
        }, {
            "SaleOrNot": {
                $regex: '.*' + query + '.*',
                "$options": "i"
            }
        }]
    }).sort({"points": -1});
    return arrayChunk(propertylist, 12);
}
export const updatePropertyService = (id, newObj) => {
    return Property.findOneAndUpdate({_id: id}, {
            $set: newObj
        },
        {upsert: false}, function (err, property) {
            if (err)
                console.log(err);
            return true;
        });
}

