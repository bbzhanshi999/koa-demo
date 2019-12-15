const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchma = new Schema({
    username:String,
    password:String,
    age:Number,
    name:String
})

module.exports = mongoose.model("User",userSchma);