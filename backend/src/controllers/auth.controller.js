import bcrypt from 'bcrypt';
import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { createUser,findUser,findOneUser } from '../dao/user.dao.js';
import config from '../config/config.js';

export async function registerController(req, res) {
    console.log('Registration attempt:', {
        body: req.body
    });

    const { username, email, password } = req.body;
    
    try {
        console.log('Checking if user exists...');
        const isUserExist = await findOneUser({
            $or: [
                { username },
                { email }
            ]
        });

        if (isUserExist) {
            console.log('User already exists:', { email, username });
            return res.status(400).json({
                message: "User already exists"
            });
        }

        console.log('Creating new user...');
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await createUser({
            username,
            email,
            password: hashedPassword
        });
        
        console.log('User created successfully:', {
            id: user._id,
            email: user.email,
            username: user.username
        });

        const token = jwt.sign({_id:user._id},config.JWT_SECRET)

        res.cookie("token",token)

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                image: user.image
            }
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({
            message: "An error occurred during registration"
        });
    }
}

export async function loginController(req,res) {
    console.log('Login attempt:', {
        body: req.body,
        headers: req.headers
    });

    const {email, password} = req.body;

    if (!email || !password) {
        console.log('Missing email or password');
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    try {
        console.log('Searching for user with email:', email);
        const user = await findOneUser({ email });
        
        if(!user){
            console.log('No user found with email:', email);
            return res.status(400).json({
                message:"Invalid email or password"
            });
        }

        console.log('User found, verifying password');
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            console.log('Password invalid for user:', email);
            return res.status(400).json({
                message:"Invalid email or password"
            });
        }

        const token = jwt.sign({_id:user._id}, config.JWT_SECRET);
        res.cookie("token", token);

        console.log('Login successful for user:', user.email);
        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                image: user.image
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({
            message: "An error occurred during login"
        });
    }
    
}