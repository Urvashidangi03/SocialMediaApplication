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