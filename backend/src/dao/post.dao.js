import postModel from "../models/post.model.js"
import userModel from "../models/user.model.js"

export async function createPost(data) {
    const {mentions = [], url, caption, user} = data
    
    let mentionIds = [];
    if (mentions.length > 0) {
        try {
            mentionIds = await Promise.all(mentions.map(async username => {
                const user = await userModel.findOne({username});
                return user ? user._id : null;
            }));
            mentionIds = mentionIds.filter(id => id !== null); // Remove any null values
        } catch (error) {
            console.warn('Error processing mentions:', error);
            // Continue with empty mentions if there's an error
        }
    }

    return await postModel.create({
        image: url,
        caption,
        user,
        mentions: mentionIds
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