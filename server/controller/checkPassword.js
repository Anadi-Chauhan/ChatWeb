const userModel = require("../models/UserModel")
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function checkPassword(request,response){
    try {
        const {password, email} = request.body
        const user = await userModel.findOne({email})
        if (!user) {
            return response.status(400).json({
                message : "User does not exist",
                error : true
            })
        }
        const verifyPassword = await bcryptjs.compare(password,user.password)
        if(!verifyPassword) {
            return response.status(400).json({
                message : "Please check password",
                error : true
            })
        }
        const tokenData = {
            id : user._id,
            email : user.email
        }

        const token  = await jwt.sign(tokenData,process.env.JWT_SECRET_KEY,{expiresIn : "7d"})

        const cookieOption = {
            httpOnly : true,
            sameSite: 'Strict',
            secure : true
        }

        return response.cookie("token",token,cookieOption).status(200).json({
            message : "LoggedIn Successfully",
           token : token,
            success : true
        })

    } catch (error) {
        console.error("Error in checkPassword:", error);
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = checkPassword