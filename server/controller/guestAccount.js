const guestModel = require("../models/guestModel");
const jwt = require("jsonwebtoken");

async function guestAccountVerification(request, response) {
  try {
    const { name, age, gender } = request.body;
    const checkName = await guestModel.findOne({ name });
    if (checkName) {
      return response.status(400).json({
        message: "User already exists",
        error: true,
      });
    }
    const payload = { name, age, gender };
    const guest = new guestModel(payload);
    const guestTokenData = {
      name: guest.name,
      age: guest.age,
      id: guest._id,
      gender: guest.gender,
    };
    const token = jwt.sign(guestTokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    };

    await guest.save();
    return response.cookie("token", token, cookieOption).status(200).json({
      message: "User registered & logged in successfully",
      token: token,
      success: true,
    });
  } catch (error) {
    console.error("Error during guest account verification:", error);
    return response.status(500).json({
      message: "An error occurred during registration",
      error: true,
    });
  }
}

module.exports = guestAccountVerification;
