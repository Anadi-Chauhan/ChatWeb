const mongoose = require('mongoose')

const guestSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,'provide name'],
        unique : true
    },
    age : {
        type : String,
        required : [true,'provid age']
    },
    gender : {
        type : String,
        required : [true,'provide gender']
    },
},{
    timestamps : true
})

const guestModel = mongoose.model('Guest',guestSchema)

module.exports = guestModel