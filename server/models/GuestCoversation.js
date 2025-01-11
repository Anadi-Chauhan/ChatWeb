const mongoose = require("mongoose");

const guestMessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: "",
    },
    msgByUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    recieverUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const guestConversationSchema = new mongoose.Schema({
    sender : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : 'User'
    },    
    reciever : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : 'User'
    },    
    messages : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "Message"
        }
    ]   
},{
    timestamps : true
})

const GuestMessageModel = mongoose.model("Message",guestMessageSchema)
const GuestConversationModel = mongoose.model("Conversation",guestConversationSchema)

module.exports = {
    GuestMessageModel,
    GuestConversationModel,
}