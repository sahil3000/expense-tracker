const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    type:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    userId:{
        type:String,    
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }
})
mongoose.model('Categories',categorySchema);