import { uploadFile } from '../services/storage.service.js';
import { generateCaption } from '../services/ai.service.js';
import { v4 as uuidv4 } from 'uuid';
import { createPost, getPosts,incrementLikeCount } from "../dao/post.dao.js";
import { createComment } from '../dao/comment.dao.js';
import { createLike, isLikeExists, deleteLike } from "../dao/like.dao.js"

export async function createPostController(req, res) {
    try {

        const { mentions } = req.body

        console.log(req.file, mentions)

        const [ file, caption ] = await Promise.all([
            uploadFile(req.file, uuidv4()), // 4s
            generateCaption(req.file) // 10s
        ])

        const post = await createPost({
            mentions,
            url: file.url,
            caption,
            user: req.user._id
        })

        res.status(201).json({
            message: "Post created successfully",
            post
        })

    } catch (error) {
        console.log(error)
    }
}

export async function getPostsController(req, res) {
    const limit = req.query.limit && req.query.limit > 20 ? 20 : req.query.limit;
    const posts = await getPosts(req.query.skip, limit);
    return res.status(200).json({
        message: "Posts fetched successfully",
        posts
    });
}

export async function createCommentController(req,res){
    const {post,text} = req.body
    const user = req.user

    const comment = await createComment({
        user:user_id,
        post,
        text
    })
    return res.status(201).json({
        message:"comment created successfully",
        comment
    })
}

export async function createLikeController(req,res){
    const {post} = req.body
    const user = req.user

    const isLikeAlreadyExists = await isLikeExists({ user: user._id, post })

    if (isLikeAlreadyExists) {
        await deleteLike({ user: user._id, post })
        await incrementLikeCount(post,-1)

        return res.status(200).json({
            message: "Like removed successfully",
            isLiked: false
        })
    }


    const like = await createLike({
        user:user_id,
        post
    })

    res.status(201).json({
        message: "Post liked successfully",
        like
    })
}