const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    },
    userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
    },
    amount:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    updatedAt:{
        type:Date,
        default: Date.now
    }
})
mongoose.model('Transactions',transactionSchema)