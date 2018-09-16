import User from "../models/User";

export  const findAllUserService=()=>{
    return User.find().exec();
}
export  const findUserByIdService=()=>{

}
export const registerUserService = (userInfo)=>{
    let user = new User(userInfo)
    user.Password = user.generateHash(user.Password);
    return user.save();
}
export const updateUserStatusService = (id)=>{
    console.log(id);
    return User.findOneAndUpdate({_id:id},{
            $set:{AccountStatus:1}
        },
        { upsert: false },function(err, user) {
            if (err)
                console.log(err);
            return true;
        });
}
