import userModel from "../models/user.model.js";

export async function createUser(data){
    return await userModel.create(data);
}

export async function findUser(query){
    return await userModel.find(query);
}

export async function findOneUser(query){
    return await userModel.findOne(query);
}

export async function findUserById(id) {
    return await userModel.findById(id).select('-password');
}

export async function findUsers(searchQuery) {
    return await userModel.find({
        $or: [
            { username: { $regex: searchQuery, $options: 'i' } },
            { name: { $regex: searchQuery, $options: 'i' } }
        ]
    }).select('-password');
}

export async function addFollower(userId, followerId) {
    await Promise.all([
        userModel.findByIdAndUpdate(
            userId,
            { $addToSet: { followers: followerId } },
            { new: true }
        ),
        userModel.findByIdAndUpdate(
            followerId,
            { $addToSet: { following: userId } },
            { new: true }
        )
    ]);
}

export async function removeFollower(userId, followerId) {
    await Promise.all([
        userModel.findByIdAndUpdate(
            userId,
            { $pull: { followers: followerId } },
            { new: true }
        ),
        userModel.findByIdAndUpdate(
            followerId,
            { $pull: { following: userId } },
            { new: true }
        )
    ]);
}