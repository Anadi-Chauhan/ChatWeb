const mongoose = require("mongoose");

async function connectDB() {
  try {
      
      const connection = mongoose.connection;
      
      connection.on("connected", () => {
          console.log("Connected to DB");
        });
        
        connection.on("error", (error) => {
            console.log("Something Went wrong in mongodb", error);
        });
        console.log("Connection attempt in progress...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Mongoose connected successfully!");
  } catch (error) {
    console.log("Something went wrong", error);
  }
}

module.exports = connectDB;
