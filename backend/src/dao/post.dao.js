import postModel from "../models/post.model.js"

export async function createPost(data) {
    
    const {mentions,url,caption,user} = data

    return await postModel.create({
        image: url,
        caption,
        user,
        mentions:await Promise.all(mentions.map(async username =>{
            return (await userModel.findOne({username}))._id
        }))
    })

}

export async function incrementLikeCount(postId,incrementBy){
    return await postModel.findByIdAndUpdate(postId,{$inc:{likeCount:incrementBy}})
}

export async function getPosts(skip=0,limit=10){
    const posts = await postModel
        .find()
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)
        .populate('user')

    return posts;
}