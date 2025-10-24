import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createCommentController, createPostController, getPostsController,createLikeController } from "../controllers/post.controller.js";
import multer from "multer";
import { createCommentValidator, getPostsValidator,createLikeValidator } from "../middlewares/validator.middleware.js";


const upload = multer({storage: multer.memoryStorage()});


const router = express.Router();


router.post('/',
    authMiddleware,
    upload.single("image"),
    createPostController)

router.get('/',
    getPostsValidator,
    authMiddleware,
    getPostsController
);

router.post('/comment',
    createCommentValidator,
    authMiddleware,
    createCommentController
)

router.post('/like',
    createLikeValidator,
    authMiddleware,
    createLikeController
)

export default router;