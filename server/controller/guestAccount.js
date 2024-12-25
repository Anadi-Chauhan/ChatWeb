const guestModel = require("../models/guestModel");
const jwt = require("jsonwebtoken");

async function guestAccountVerification(request, response) {
  try {
    const { name, age ,gender } = request.body;


    const checkName = await guestModel.findOne({ name });

    if (checkName) {
      return response.status(400).josn({
        message: "user already exist",
        error: true,
      });
    }

    const payload = {
      name,
      age,
      gender,
    };
    const guest = new guestModel(payload);
    const guestSave = await guest.save();

    const guestTokenData = {
      name: guest.name,
      age: guest.age,
    };


    const token = jwt.sign(guestTokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });


    const cookieOption = {
      httpOnly: true,
      secure: true,
    };

    return response.cookie("token", token, cookieOption).status(200).json({
      message: "user registered & User LoggedIn successfully",
      token: token,
      data : guestSave,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: "you cant code",
      error: true,
    });
  }
}

module.exports = guestAccountVerification;

