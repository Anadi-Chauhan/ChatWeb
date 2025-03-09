const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required : [true,"provide name"]
    },
    email : {
        type: String,
        required : [true,"provide name"],
        unique : true
    },
    password : {
        type: String,
        required : [true,"provide password"]
    },
    profile_pic : {
        type: String,
        default : ""
    },
    otp: {
        type: String,
        default : "",
    },
    bgImage: {
        type: String,
        default: "",
    },
    about: {
        type: String,
        default: "",
    },    
    work: {
        type: String,
        default: "",
    },    
    education: {
        type: String,
        default: "",
    },    
    relation: {
        type: String,
        default: "",
    },    
    goal: {
        type: String,
        default: "",
    },    
    location: {
        type: String,
        default: "",
    },
},{
    timestamps : true
})

const userModel = mongoose.model('User',userSchema)

module.exports = userModel