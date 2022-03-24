const mongoose = require('mongoose')
const Users = mongoose.model('Users')
const bcrypt = require('bcryptjs')

const signup =(req,res)=>{
    Users.findOne({$or:[{'email': req.body.email}, {'username': req.body.username}]},(err,response)=>{
        if(err){
            res.status(400).json({error:true,msg: 'err',body:err})
        }
        else if(response){
            res.status(400).json({error:true,msg: 'email or username is already exists',body:[]})
        }else{
            const user = new Users()
            user.email=req.body.email
            user.name=req.body.name
            user.gender=req.body.gender
            user.contactNo=req.body.contactNo
            user.address=req.body.address
            user.city=req.body.city
            user.pinCode=req.body.pinCode
            user.username=req.body.username
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(req.body.password, salt);
            req.body.password=hash;
            user.password=req.body.password
            user.save((err,resp)=>{
                if(err){
                    res.status(400).json({error:true,msg: 'error',body:err})
                }
                else if(resp){
                    res.status(201).json({ error:false,msg:"Successfully created",body:resp})
                }
                else{
                    res.status(500).json({error:true,msg:"Internal Server Error",body:[]})
                }
            })
        }
    })
}
module.exports = {signup}