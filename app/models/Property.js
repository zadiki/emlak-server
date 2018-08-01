import mongoose from 'mongoose';


const Schema = mongoose.Schema;

var PropertySchema = new Schema({
    Description: String,
    Category:{type: Schema.Types.ObjectId, ref: 'Category'},
    SaleOrNot:{type:Number,default:1},
    Price:{type:String,default:"Not Available"},
    PaymentMode:{type:Number,default:2},
    PostedBy:{type: Schema.Types.ObjectId, ref: 'User'},
    Road:String,
    Location:{type: Schema.Types.ObjectId, ref: 'Location'},
    Longitude:String,
    Latitude:String,
    ImageUrl:{type:String,trim:true,default:"images/company/logo.jpg"}
}, { timestamps: true });

export default mongoose.model('Property', PropertySchema);
