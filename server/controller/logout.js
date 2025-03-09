async function logout(request,response) {
    try {
        
        const cookieOption = {
            httpOnly : true,
            sameSite: 'Strict',
            // secure : true, 
            path:"/",
        }
        return response.clearCookie("token",cookieOption).status(200).json({
            message : "Session out",
            success : true,
            
        })

        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = logout