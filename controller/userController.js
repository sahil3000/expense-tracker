const mongoose = require('mongoose')
const Users = mongoose.model('Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('./utils');

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

const login =(req,res)=>{
    Users.findOne({email:req.body.email},(err,doc)=>{
        if(err){
            console.log(err);
            res.status(500).send({msg:"All field are field",error:true,body:[]});
        }
        else if(doc){
            bcrypt.compare(req.body.password,doc.password,(err,passwordValid)=>{
                if(err){
                    console.log(err);
                    res.status(500).send({msg:"All field are field",error:true,body:[]});
                }
                else if(passwordValid){
                    const token = jwt.sign(doc.email, JWT_SECRET_KEY);
                    const response = doc
                    response.password=''
                    res.status(200).send({
                        msg:"success",
                        error:false,
                        body:response,
                        token:token
                    });
                }
                else{
                    console.log("User or password is wrong1")
                    res.status(401).send({msg:"email or password is wrong",error:true,body:[]});
                }
            })
        }
        else{
            console.log("User or password is wrong")
            res.status(401).send({msg:"email or password is wrong",error:true,body:[]});
        }
    });
}


module.exports = {signup,login}