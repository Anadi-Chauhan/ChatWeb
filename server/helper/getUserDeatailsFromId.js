// const userModel = require("../models/UserModel");

// async function FriendDetails(request, response) {
//   try {
//     const userId = request.body
//       const user = await userModel.findById(userId).select("-password");

//       return response.status(200).json({
//         message : "User Details",
//         data : user
//     })
//   } catch (error) {
//     return response.status(500).json({
//       message: error,
//       error: true,
//     });
//   }
// }

// module.exports = FriendDetails;
