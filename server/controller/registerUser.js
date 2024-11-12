const userModel = require("../models/UserModel")
const bcryptjs = require("bcryptjs")

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

        const payload = {
            name,
            email,
            profile_pic,
            password : hashPassword
        }

        const user = new userModel(payload)
        const userSave = await user.save()

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