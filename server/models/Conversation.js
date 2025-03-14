const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    text : {
        type : String,
        default : ""
    },
    imageUrl : {
        type : String,
        default : ""
    },
    videoUrl : {
        type : String,
        default : ""
    },
    audioUrl : {
        type : String,
        default : ""
    },
    msgByUserId : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : 'User'
    },
    recieverUserId : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : 'User'
    },
    sender_name : {
        type : String,
        default : ""
    },    
    reciever_name : {
        type : String,
        default : ""
    },
    sender_profile_pic : {
        type : String,
        default : ""
    },   
    reciever_profile_pic : {
        type : String,
        default : ""
    },
    seen : {
         type : Boolean,
        default : false
    },

},{
    timestamps : true
})

const conversationSchema = new mongoose.Schema({
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




const MessageModel = mongoose.model("Message",messageSchema)
const ConversationModel = mongoose.model("Conversation",conversationSchema)

module.exports = {
    MessageModel,
    ConversationModel,
}