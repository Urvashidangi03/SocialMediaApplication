import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    image:{
        type: String,
        required: true
    },
    caption:{
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likeCount:{
        type: Number,
        default: 0
    },
    mentions:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
]
},{
    timestamps: true
})

const post = mongoose.model('posts',postSchema);

export default post;