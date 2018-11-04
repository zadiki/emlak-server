import User from "../models/User";

export const findAllUserService = () => {
    return User.find().exec();
}
export const findUserByIdService = (id) => {
    return User.find({_id: id}).select('-Local.Password').exec();
}
export const registerUserService = (userInfo) => {
    let user = new User(userInfo)
    user.Local.Password = user.generateHash(user.Local.Password);
    return user.save();
}
export const updateUserStatusService = (id) => {
    return User.findOneAndUpdate({_id: id}, {
            $set: {AccountStatus: 1}
        },
        {upsert: false}, function (err, user) {
            if (err)
                console.log(err);
            return true;
        });
}
