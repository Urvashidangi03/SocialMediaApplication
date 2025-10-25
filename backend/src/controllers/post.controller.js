import { uploadFile } from '../services/storage.service.js';
import { generateCaption } from '../services/ai.service.js';
import { v4 as uuidv4 } from 'uuid';
import { createPost, getPosts,incrementLikeCount } from "../dao/post.dao.js";
import { createComment } from '../dao/comment.dao.js';
import { createLike, isLikeExists, deleteLike } from "../dao/like.dao.js"

export async function createPostController(req, res) {
    try {
        console.log('=== Create Post Request ===');
        console.log('User:', req.user?._id);
        console.log('File:', req.file ? {
            fieldname: req.file.fieldname,
            mimetype: req.file.mimetype,
            size: req.file.size
        } : 'No file');
        console.log('Mentions:', req.body.mentions);

        if (!req.file) {
            console.error('No file provided in request');
            return res.status(400).json({ message: 'Image file is required' });
        }

        console.log('Starting file upload...');
        let file;
        try {
            file = await uploadFile(req.file, uuidv4());
            console.log('File uploaded successfully:', file.url);
        } catch (uploadError) {
            console.error('File upload failed:', uploadError);
            return res.status(500).json({ 
                message: 'Failed to upload image', 
                error: uploadError.message 
            });
        }

        console.log('Generating caption...');
        let caption = '';
        try {
            caption = await generateCaption(req.file);
            console.log('Caption generated:', caption);
        } catch (captionError) {
            console.warn('Caption generation failed, continuing with empty caption:', captionError);
        }

        console.log('Creating post in database...');
        const post = await createPost({
            mentions: req.body.mentions ? req.body.mentions.split(',').map(m => m.trim()) : [],
            url: file.url,
            caption,
            user: req.user._id
        });
        console.log('Post created successfully:', post._id);

        return res.status(201).json({
            message: "Post created successfully",
            post
        })

    } catch (error) {
        console.error('Failed to create post:', error);
        return res.status(500).json({ message: 'Failed to create post', error: error.message });
    }
}

export async function getPostsController(req, res) {
    const limit = req.query.limit && req.query.limit > 20 ? 20 : req.query.limit;
    const skip = parseInt(req.query.skip) || 0;
    console.log('Fetching posts with skip:', skip, 'limit:', limit);
    
    const posts = await getPosts(skip, limit);
    console.log('Found posts:', posts.length);
    console.log('Sample post structure:', posts[0]);
    
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