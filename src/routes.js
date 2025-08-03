import express from 'express';
import { generate } from 'otp-generator';
import { isFieldEmpty } from './utils/helpers.js';
import { sendMail } from './mailer/index.js';

const appRouter = express.Router();

const userMap = new Map();

appRouter.post('/register', async(req, res)=>{
    // req -> email, name, password
    const {name, email, password} = req.body;
    if (isFieldEmpty(name) || isFieldEmpty(email) || isFieldEmpty(password)) {
        //return error response
        return res.status(401).json({message: "Invalid data received"});
    }

    try{
        const user = addNewUser(name, email, password); 
        if (!user) {
            return res.status(422).json({message: "Unable to create user"});
        }
        await sendMail(email, user.otp);
        return res.status(200).json({ user })
    } catch(e){
        console.log(e);        
        return res.status(500).json({message: "Internal server error"});
    }
});

appRouter.post('/verify', (req, res)=>{
    // req -> email, name, password
    const {email, otp} = req.body;
    if (isFieldEmpty(email) || isFieldEmpty(otp)) {
        //return error response
        return res.status(401).json({message: "Invalid data received"});
    }

    try{
        const user = userMap.get(email); 
        if (!user) {
            return res.status(403).json({message: "User not found"});
        }
        if (user.otp === otp){
            user.isVerified = true;
            return res.status(200).json({message: "OTP Verified", user});
        }
        else {
            return res.status(401).json({message: "Invalid OTP"});
        }
    } catch(e){
        console.log(e);        
        return res.status(500).json({message: "Internal server error"});
    }
});

appRouter.post('/login', (req, res)=>{
    // req -> email, name, password
    const {email, password} = req.body;
    if (isFieldEmpty(email) || isFieldEmpty(password)) {
        //return error response
        return res.status(401).json({message: "Invalid data received"});
    }

    try{
        const user = userMap.get(email); 
        if (!user) {
            return res.status(403).json({message: "User not found"});
        }
        if (user.isVerified && user.password == password){
            return res.status(200).json({message: "User Logged In Successfully", user});
        }
        else {
            return res.status(401).json({message: "Invalid Email/Password"});
        }
    } catch(e){
        console.log(e);        
        return res.status(500).json({message: "Internal server error"});
    }
});

const addNewUser = (name, email, password) => {
    const id = crypto.randomUUID()
    const otp = generate(4, {digits:true, lowerCaseAlphabets: false, specialChars: false, upperCaseAlphabets: false})
    const user = {
        id, 
        name, 
        email,
        password,
        otp,
        isVerified: false
    }
    const addedUser = userMap.set(email, user);
    return addedUser.get(email);
}

export default appRouter;