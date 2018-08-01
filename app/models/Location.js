import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var LocationSchema = new Schema({
    Country: {type:String,required:true,default:"Kenya"},
    County: {type:String,trim:true,required:true},
    Region:{type:String,trim:true},
    Longitude:String,
    Latitude:String
}, { timestamps: true });

export default mongoose.model('Location', LocationSchema);
