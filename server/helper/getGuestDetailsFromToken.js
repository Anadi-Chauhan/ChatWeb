const jwt = require('jsonwebtoken')
const guestModel = require('../models/guestModel')

const getGuestDetailsFromToken = async (token) => {

    if (!token) {
        
        return {
            message : "Can't Find token",
            logout : true
        }
    }

    const decode = await jwt.verify(token,process.env.JWT_SECRET_KEY)

    const user = await guestModel.findById(decode.id)

    return user

}

module.exports = getGuestDetailsFromToken