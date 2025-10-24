import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'posts',
        required:true
    },
    text:{
        type:String,
        required:true
    }
}, { timestamps: true })

const commentModel = mongoose.model('Comment', commentSchema);

export default commentModel;