import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

var UserSchema = new Schema({
    Fname: {type: String, trim: true, required: true},
    Lname: {type: String, trim: true, required: true},
    ProfileName: {type: String, trim: true, required: true},
    Email: {type: String, trim: true, unique: true},
    Local: {
        Password: String
    },
    Facebook: {
        id: String,
        token: String
    },
    Google: {
        id: String,
        token: String
    },
    Phone: String,
    PublicInfo: String,
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
    if(this.Local.Password) {
        return bcrypt.compareSync(password, this.Local.Password);
    }else{
        return false;
    }
};

UserSchema.methods.generateJWT = function () {
    var exp = new Date();
    return jwt.sign({
        id: this._id,
        exp: parseInt((exp.getTime() / 1000)+(60*10)),
    }, process.env.JWT_SECRET_KEY);
};

UserSchema.methods.toAuthJSON = function () {
    return {
        token: this.generateJWT(),
    };
};

export default mongoose.model('User', UserSchema);
