const userModel = require('../models/UserModel')
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function login(request,response) {
    try {
        console.log('gotreq')
        const {email,password}=request.body
        
        const user = await userModel.findOne({email})
        
        if (!user) {
            return response.status(400).json({
                message:"User not Found",
                error: true
            })
        }
        
        console.log('gotreq')
        const tokenData = {
            id: user._id,
            email: user.email
        }
        
        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY,{
            expiresIn:"1d",
        })
        
        const cookieOption = {
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge: 24 * 60 * 60 * 1000
        }
        
        console.log('gotreq')
        await user.save();

        return response.cookie("token", token, cookieOption).status(200).json({
            message: "OTP VERIFIED & USER LoggedIn Successfully",
            token: token,
            success: true,
          });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
          });
    }
}

module.exports = login;