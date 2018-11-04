import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

var UserSchema = new Schema({
    Fname: {type: String, trim: true, required: true},
    Lname: {type: String, trim: true, required: true},
    Email: {type: String, trim: true, unique: true},
    Local:{
         Password: String
         },
    Facebook:{
        id:String,
        token:String
    },
    Phone: {type: String, unique: true},
    Avatar: {type: String, default: "/images/company/user.png"},
    AccountStatus: {type: Number, default: 0},
    UserLevel: {type: Number, default: 1},
    Points: {type: Number, default: 10}
}, {timestamps: true});

UserSchema.plugin(uniqueValidator, {message: '{VALUE} is already taken.'});

UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function (password) {
    console.log("password compare",password);
    return bcrypt.compareSync(password, this.Local.Password);
};

UserSchema.methods.generateJWT = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};

UserSchema.methods.toAuthJSON = function () {
    return {
        username: this.username,
        email: this.email,
        token: this.generateJWT(),
        bio: this.bio,
        image: this.image
    };
};

export default mongoose.model('User', UserSchema);
