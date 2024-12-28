const userModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");

async function verifyOtp(request, response) {
  try {
    const { email, otp } = request.body;
    console.log(otp);
    const user = await userModel.findOne({ email });

    if (!user) {
      return response.status(400).json({
        message: "User not found",
        error: true,
      });
    }
    console.log(user?.otp);
    if (user.otp !== otp) {
      return response.status(400).json({
        message: "Invalid OTP",
        error: true,
      });
    }
    const tokenData = {
      id: user._id,
      email: user.email,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: 'https://infinitychats.vercel.app'
    };

    user.otp = undefined;
    await user.save();

    console.log("DOne");
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

module.exports = verifyOtp;

// if (user.otpExpiresAt < Date.now()) {
//   return response.status(400).json({
//     message: "OTP expired",
//     error: true,
//   });
// }
// user.otpExpiresAt = undefined;
// Check if OTP matches and is not expired
