const { json } = require('express/lib/response')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { responseCode } = require('../common/commonFunction')
const User = mongoose.model('Users')
const Category = mongoose.model('Categories')
const { JWT_SECRET_KEY } = require('./utils')

const addCategory = async (req, res) => {
    const params = req.body
    const data = { error: false, body: [], msg: "" }
    if (!params.type || !params.title) {
        return responseCode(res, true, 'please fill mandatory field', [], 401)
    } else {
        req.body.type = req.body.type.toLowerCase()
        req.body.title = req.body.title.toLowerCase()
        const isValidType = ['expense', 'income'].find(data => data.toLowerCase() === req.body.type.toLowerCase())
        if (!isValidType) {
            return responseCode(res, true, 'invalid type', [], 401)
        }
        if (!req.headers.authorization) {
            return responseCode(res, true, 'please provide token', [], 401)
        } else {
            try {
                const email = await jwt.verify(req.headers.authorization, JWT_SECRET_KEY)
                const user = await User.findOne({ email }).select(['name']);
                const isCategoryExist = await Category.findOne({
                    $and: [
                        { userId: user._id },
                        { type: params.type },
                        { title: params.title }]
                })
                if (isCategoryExist && isCategoryExist != null) {
                    return responseCode(res, true, 'category already exists', [], 409)
                }
                const category = new Category()
                category.userId = user._id
                category.type = params.type
                category.title = params.title
                const response = await category.save()
                if (response) {
                    return responseCode(res, false, 'category successfully added', [], 201)
                }
                return responseCode(res, true, 'internal server error', [], 500)
            } catch (err) {
                return responseCode(res, true, err.message, [], 401)
            }
        }
    }
}

const getAllCategories = async (req, res) => {
    if (!req.headers.authorization) {
        return responseCode(res, true, 'please provide token', [], 401)
    }
    try {
        const email = jwt.verify(req.headers.authorization, JWT_SECRET_KEY)
        const user = await User.findOne({ email }).select('_id')
        console.log(user)
        if (user) {
            const categories = await Category.find({ userId: user._id })
            return responseCode(res, false, 'successfully fetch', categories, 200)
        }
        return responseCode(res, true, 'internal server error', [], 500)
    } catch (err) {
        return responseCode(res, true, err.message, [], 401)
    }
}

const getCategory = async (req, res) => {
    if (!req.params.categoryId) {
        return responseCode(res, true, 'please fill mandatory fields', [], 401)
    }
    if (!req.headers.authorization) {
        return responseCode(res, true, 'please provide token', [], 401)
    }
    try {
        const email = jwt.verify(req.headers.authorization, JWT_SECRET_KEY)
        const user = await User.findOne({ email }).select('_id')
        if (user) {
            try {
                const categories = await Category.findOne({
                    $and:
                        [
                            { userId: user._id },
                            { _id: req.params.categoryId }
                        ]
                })
                return responseCode(res, false, 'successfully fetch', categories, 200)
            } catch (err) {
                return responseCode(res, true, 'Please enter valid category id', [], 401)
            }
        }
        return responseCode(res, true, 'internal server error', [], 500)
    } catch (err) {
        return responseCode(res, true, err.message, [], 401)
    }
}

const updateCategory = async (req, res) => {
    if (!req.body.categoryId || !req.body.type || !req.body.title) {
        console.log(req.body)
        return responseCode(res, true, 'please fill mandatory fields', [], 401)
    }
    req.body.type = req.body.type.toLowerCase()
    req.body.title = req.body.title.toLowerCase()
    const isValidType = ['expense', 'income'].find(data => data.toLowerCase() === req.body.type.toLowerCase())
    if (!isValidType) {
        return responseCode(res, true, 'invalid type', [], 401)
    }
    if (!req.headers.authorization) {
        return responseCode(res, true, 'please provide token', [], 401)
    }
    try {
        const email = jwt.verify(req.headers.authorization, JWT_SECRET_KEY)
        const user = await User.findOne({ email }).select('_id')
        if (user) {
            try {
                const category = await Category.findOne({
                    $and:
                        [
                            { userId: user._id },
                            { _id: req.body.categoryId }
                        ]
                })
                category.type = req.body.type;
                category.title = req.body.title;
                console.log(new Date().toISOString())
                category.updatedAt = new Date().toISOString();
                const response = await category.save();
                return responseCode(res, false, 'successfully updated', response, 201)
            } catch (err) {
                return responseCode(res, true, 'category not found', [], 401)
            }
        }
        console.log("end")
        return responseCode(res, true, 'Invalid user', [], 500)
    } catch (err) {
        return responseCode(res, true, err.message, [], 401)
    }
}

const deleteCategory = async (req, res) => {
    if (!req.params.categoryId) {
        return responseCode(res, true, 'please fill mandatory fields', [], 401)
    }
    
    if (!req.headers.authorization) {
        return responseCode(res, true, 'please provide token', [], 401)
    }
    try {
        const email = jwt.verify(req.headers.authorization, JWT_SECRET_KEY)
        const user = await User.findOne({ email }).select('_id')
        if (user) {
            try {
                console.log("req.params.categoryId",req.params.categoryId)
                const category = await Category.findOne({
                    $and:
                        [
                            { userId: user._id },
                            { _id: req.params.categoryId }
                        ]
                })
                const response = await category.delete();
                return responseCode(res, false, 'successfully deleted', response, 200)
            } catch (err) {
                return responseCode(res, true, 'category not found', [], 401)
            }
        }
        console.log("end")
        return responseCode(res, true, 'Invalid user', [], 401)
    } catch (err) {
        return responseCode(res, true, "Invalid token", [], 401)
    }
}

module.exports = { addCategory, getAllCategories, getCategory, updateCategory,deleteCategory }