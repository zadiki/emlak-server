import mongoose from 'mongoose';


const Schema = mongoose.Schema;

var PropertySchema = new Schema({
    Category:{type:String},
    Description: String,
    SaleOrNot:{type:String},
    Price:{type:String,default:"Not Available"},
    PaymentMode:{type:String},
    PostedBy:{type: Schema.Types.ObjectId, ref: 'User'},
    Location: {
        type: { type: String },
        coordinates: []
    },
    Address:{type:String},
    ImageUrl:{type:Array,trim:true,default:["images/company/logo.jpg"]},
    workspace:{type:String},
    Bedroom:{type:String,default:"Not stated"},
    Bathroom:{type:String,default:"Not stated"},
    IsMasterAndSuite:{type:Boolean,default:false},
    Furnished:{type:String,default:"Not stated"},
    Parking:{type:String,default:"Not stated"},
    Bedsize:{type:String,default:"Not stated"},
    NoOfBeds:{type:String,default:"Not stated"},
    HotShower:{type:String,default:"Not stated"},
    SwimmingPool:{type:String,default:"Not stated"},
    BreakfastProvided:{type:String,default:"Not stated"},
    points:{type:Number,default:500},
    views:{type:Number,default:0}

}, { timestamps: true });
PropertySchema.index({ "loc": "2dsphere" });
export default mongoose.model('Property', PropertySchema);
