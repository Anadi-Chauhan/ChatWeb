const getGuestDetailsFromToken = require("../helper/getGuestDetailsFromToken")


async function guestDetails(request, response){
    try {
        
        const token = request.cookies.token || ''
        
        const user = await getGuestDetailsFromToken(token)



        return response.status(200).json({
            message : "User Details",
            data : user
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports =  guestDetails