const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required:'email is mandatory field',
        unique:true
    },
    name:{
        type: String,
        required:'name is mandatory field',
    },
    password:{
        type:String,
        required:"password is mandatory field"
    },
    username:{
        type:String,
        required:"username is mandatory field",
        unique:true
    },
    password:{
        type:String,
        required:"password is mandatory field"
    },
    isActive:{
        type:Boolean,
        default:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    secretCode:{
        type:String,
        default:''
    },
    gender:{
        type:String,
        required:"gender is mandatory field"
    },
    contactNo:{
        type:String,
        required:"contact number is mandatory field"
    },
    address:{
        type:String,
        required:"Address is mandatory field"
    },
    city:{
        type:String,
        required:"city is mandatory field"
    },
    pinCode:{
        type:String,
        required:"pinCode is mandatory field"
    },
    lastLoginDate:  { type : Date, default: Date.now },
    createdAt:{ type : Date, default: Date.now },
    updatedAt:{ type : Date, default: Date.now }
})
mongoose.model('Users',userSchema);