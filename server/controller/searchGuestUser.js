const guestModel = require("../models/guestModel")

async function searchGuestUser(request,response){
    try {
        const {search} = request.body

        const query = new RegExp(search,"i","g")

        const user = await guestModel.find({
            "$or" : [
                {name : query},
                {gender : query},
                {age : query}
            ]
        })

        return response.json({
            message: "all user",
            data : user,
            success : true
        })
        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = searchGuestUser