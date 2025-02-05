const userModel = require("../models/UserModel")
const bcryptjs = require("bcryptjs")
const nodemailer = require("nodemailer");
require("dotenv").config();

async function registerUser(request,response) {

    console.log("Request body:", request.body);

    try {
        const {name, email, password, profile_pic} = request.body

        const checkEmail = await userModel.findOne({email})

        if (checkEmail) {
            return response.status(400).json({
                message : "User already exist",
                error : true
            })
        }
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        function generateOTP() {
            return Math.floor(100000 + Math.random() * 900000).toString();
        }
        
        const otp = generateOTP();
        console.log("Generated OTP:", otp);

        const payload = {
            name,
            email,
            profile_pic,
            password : hashPassword,
            otp,
            // otpExpiresAt: Date.now() + 10 * 60 * 1000,
        }

        const user = new userModel(payload)
        const userSave = await user.save()

            // Set up Nodemailer transporter
            const transporter = nodemailer.createTransport({
                service: "gmail", // Use your email provider (e.g., Gmail, Outlook)
                auth: {
                    user: process.env.USER_EMAIL, // Replace with your email
                    pass: process.env.USER_EMAIL_PASSKEY, // Replace with your email password or app password
                },
            });


    
            // Define the email content
            const mailOptions = {
                from: process.env.USER_EMAIL, // Sender's email
                to: email, // Recipient's email
                subject: "Welcome to Our Platform",
                html: `<h1>Hi ${name},</h1>
                       <p>Welcome to our platform! We're excited to have you on board.</p>
                       <p>If you have any questions, feel free to contact us.</p>
                       <p>Best Regards,<br>Your Company</p>
                       <h3>Your Otp For Verification is ${otp}`,
            };
    
            // Send the email
            await transporter.sendMail(mailOptions);

        return response.status(201).json({
            message : "User Created Successfully",
            data : userSave,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
    
}

module.exports = registerUser