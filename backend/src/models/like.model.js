import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
    user : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true },
    post : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post', 
        required: true }
})

const likeModel = mongoose.model('Like', likeSchema);

export default likeModel;