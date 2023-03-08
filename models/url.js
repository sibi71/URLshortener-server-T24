const mongoose = require("mongoose")


const urlSchema = new mongoose.Schema({
    longurl:{
        type:String,
        required:true,
    },
    shorturl:{
        type:String,
        unique:true,

    }
    
},{timestamps:true})

const url = mongoose.model("urls",urlSchema)

module.exports = url