const mongoose = require('mongoose')
const Users = mongoose.model('Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('./utils');
const { responseCode } = require('../common/commonFunction');

const signup = (req, res) => {
    console.log(req.body)
    if(!req.body.email || !req.body.name || !req.body.password){
        return responseCode(res, true, 'please provide all mandatory fields', [], 401)
    }
    // Users.findOne({ $or: [{ 'email': req.body.email }, { 'username': req.body.username }] }, (err, response) => {
    Users.findOne( { 'email': req.body.email }, (err, response) => {
        if (err) {
            return responseCode(res, true, 'error', [], 401)
        }
        else if (response) {
            console.log(response)
            return responseCode(res, true, 'email or username is already exists', [], 401)
        } else {
            const user = new Users()
            user.email = req.body.email
            user.name = req.body.name
            user.gender = req.body.gender
            user.contactNo = req.body.contactNo
            user.address = req.body.address
            user.city = req.body.city
            user.pinCode = req.body.pinCode
            user.username = req.body.username
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(req.body.password, salt);
            req.body.password = hash;
            user.password = req.body.password
            user.save((err, resp) => {
                if (err) {
                    return responseCode(res, true, 'internal server error', [], 500)
                }
                else if (resp) {
                    const { _doc } = resp
                    delete _doc.password
                    return responseCode(res, false, 'Successfully created', resp, 201)
                }
                else {
                    return responseCode(res, true, 'internal server error', [], 500)
                }
            })
        }
    })
}

const login = (req, res) => {
    if(!req.body.email ||  !req.body.password){
        return responseCode(res, true, 'All field are field', [], 401)
    }
    Users.findOne({ email: req.body.email }, (err, doc) => {
        if (err) {
            console.log(err);
            return responseCode(res, true, 'Internal server error', [], 500)
        }
        else if (doc) {
            bcrypt.compare(req.body.password, doc.password, (err, passwordValid) => {
                if (err) {
                    console.log(err);
                    return responseCode(res, true, 'Internal server error', [], 500)
                    // res.status(400).send({ msg: "All field are field", error: true, body: [] });
                }
                else if (passwordValid) {
                    const token = jwt.sign(doc.email, JWT_SECRET_KEY);
                    const response = doc
                    const { _doc } = response
                    delete _doc.password
                    _doc.token=token
                    console.log(_doc)
                    return responseCode(res, false, 'login successfully', _doc, 200)
                }
                else {
                    console.log("User or password is wrong1")
                    return responseCode(res, true, 'email or password is wrong', [], 401)
                }
            })
        }
        else {
            console.log("User or password is wrong")
            return responseCode(res, true, 'email or password is wrong', [], 401)
        }
    });
}


module.exports = { signup, login }