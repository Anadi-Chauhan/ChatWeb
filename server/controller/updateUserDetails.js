const getUserDetailsFromToken = require("../helper/getUserDetailsFromToken")
const userModel = require("../models/UserModel")

async function updateUserDetails(request,response) {
    try {

        const token = request.cookies.token || ""

        const user = await getUserDetailsFromToken(token)

        const {name,bgImage, profile_pic,about,work,education,relation,goal,location} = request.body

        const updateUser = await userModel.updateOne({_id : user._id},{
            name,
            profile_pic,
            about,
            work,
            education,
            relation,
            goal,
            location,
            bgImage
        })

        const userInformation = await userModel.findById(user._id)
        console.log("xxxx",userInformation)

        return response.json({
            message :"user updated successfully",
            data : userInformation,
            success : true
        })
        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = updateUserDetails