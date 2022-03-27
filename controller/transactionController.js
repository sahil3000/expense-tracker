const mongoose = require('mongoose')
const { responseCode } = require('../common/commonFunction')
const User = mongoose.model('Users')
const Transaction = mongoose.model('Transactions')
const Category = mongoose.model('Categories')
const jwt = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('./utils')
const newTransaction = async (req,res)=>{
    if(!req.body.categoryId || !req.body.amount){
        return responseCode(res,true,'please provide mandatory fields',[],401)
    }
    if(!req.headers.authorization){
        return responseCode(res, true, 'please provide token', [], 401)
    }
    try{
        const email=jwt.verify(req.headers.authorization,JWT_SECRET_KEY)
        const user = await User.findOne({email}).select('_id')
        if(user){
            try{
                await Category.findById(req.body.categoryId)
                const transaction = new Transaction()
                transaction.categoryId=req.body.categoryId
                transaction.amount=req.body.amount
                transaction.userId=user.id
                await transaction.save()
                return responseCode(res, false, 'transaction successfully added', [], 201)
            }catch(err){
                return responseCode(res, true, 'invalid category', [], 401)
            }
        }
        return responseCode(res, true, 'Invalid user', [], 401)
    }catch(err){
        return responseCode(res, true, err.message, [], 401)
    }
}

const getTransactions = async (req,res)=>{
    if(!req.headers.authorization){
        return responseCode(res, true, 'please provide token', [], 401)
    }
    try{
        const email=jwt.verify(req.headers.authorization,JWT_SECRET_KEY)
        const user = await User.findOne({email}).select('_id')
        if(user){
            try{
                const  transaction = await Transaction.find({userId:user._id}).sort('-createdAt')
                .populate({path:'categoryId',select:['type','title']})
                // .populate('categoryId')
                return responseCode(res, false, 'transaction successfully fetch', transaction, 201)
            }catch(err){
                return responseCode(res, true, 'something went wrong', [], 401)
            }
        }
        return responseCode(res, true, 'Invalid user', [], 401)
    }catch(err){
        return responseCode(res, true, err.message, [], 401)
    }
}

module.exports={newTransaction,getTransactions}