import mongoose from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

var CategoryTypeSchema = new Schema({
    Name: {type: String, unique: true,required:true},
}, {timestamps: true});
CategoryTypeSchema.plugin(uniqueValidator, {message: '{VALUE} is already taken.'});
export default mongoose.model('CategoryType', CategoryTypeSchema);
