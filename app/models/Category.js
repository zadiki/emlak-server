import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

var CategorySchema = new Schema({
    CategoryType:{type: Schema.Types.ObjectId, ref: 'PropertyType',required:true},
    Bedroom:{type:String,default:"Not stated"},
    Bathroom:{type:String,default:"Not stated"},
    IsMasterAndSuite:{type:Boolean,default:false},
    Furnished:{type:String,default:"Not stated"},
    Parking:{type:String,default:"Not stated"},
    Bedsize:{type:String,default:"Not stated"},
    NoOfBeds:{type:String,default:"Not stated"},
    HotShower:{type:String,default:"Not stated"},
    BreakfastProvided:{type:String,default:"Not stated"},
}, { timestamps: true });

export default mongoose.model('Category', CategorySchema);
