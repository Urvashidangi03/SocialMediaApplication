import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: true
    },
    bio:{
        type: String,
        default: '',
        trim: true
    },
    image:{
        type: String,
        default: 'https://ik.imagekit.io/uy58fssmo/default-profile.png',
        trim: true
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

const userModel = mongoose.model('User', userSchema);

export default userModel;