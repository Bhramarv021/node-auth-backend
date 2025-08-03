import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Debugging environment variables
console.log("Mailer credentials:", process.env.GMAIL_EMAIL, process.env.GMAIL_EMAIL);

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD
    }
});

export const sendMail = (emailId, otp) => {
    console.log("Email and otp : ", emailId, otp);
    
    return new Promise((resolve, reject) => {
        transporter.sendMail({
            from: process.env.GMAIL_EMAIL,
            to: emailId,
            subject: 'Your OTP to login',
            text: `Your OTP is : ${otp}`
        }, (err, info) => {      
            if (err) 
                reject(err);
            else 
                resolve("OK");
        });
    });
};