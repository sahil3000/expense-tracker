const mongoose = require('mongoose')
const { responseCode } = require('../common/commonFunction')
const User = mongoose.model('Users')
const Transaction = mongoose.model('Transactions')
const Category = mongoose.model('Categories')
const jwt = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('./utils')
// const needle = require('needle')
const ObjectsToCsv = require('objects-to-csv');
const fs = require('fs')
const imageDownload = require('image-downloader')

const newTransaction = async (req, res) => {
    if (!req.body.categoryId || !req.body.amount) {
        return responseCode(res, true, 'please provide mandatory fields', [], 401)
    }
    if (!req.headers.authorization) {
        return responseCode(res, true, 'please provide token', [], 401)
    }
    try {
        const email = jwt.verify(req.headers.authorization, JWT_SECRET_KEY)
        const user = await User.findOne({ email }).select('_id')
        if (user) {
            try {
                await Category.findById(req.body.categoryId)
                const transaction = new Transaction()
                transaction.categoryId = req.body.categoryId
                transaction.amount = req.body.amount
                transaction.userId = user.id
                await transaction.save()
                return responseCode(res, false, 'transaction successfully added', [], 201)
            } catch (err) {
                return responseCode(res, true, 'invalid category', [], 401)
            }
        }
        return responseCode(res, true, 'Invalid user', [], 401)
    } catch (err) {
        return responseCode(res, true, err.message, [], 401)
    }
}

const getTransactions = async (req, res) => {
    if (!req.headers.authorization) {
        return responseCode(res, true, 'please provide token', [], 401)
    }
    try {
        const email = jwt.verify(req.headers.authorization, JWT_SECRET_KEY)
        const user = await User.findOne({ email }).select('_id')
        if (user) {
            try {
                const transaction = await Transaction.find({ userId: user._id }).sort('-createdAt')
                    .populate({ path: 'categoryId', select: ['type', 'title'] })
                transaction.forEach(data => {
                    const { _doc } = data
                    console.log(_doc)
                    _doc.categoryTitle = _doc.categoryId.title
                    _doc.categoryType = _doc.categoryId.type
                    _doc.categoryId = _doc.categoryId._id
                })
                // .populate('categoryId')
                return responseCode(res, false, 'transaction successfully fetch', transaction, 201)
            } catch (err) {
                return responseCode(res, true, 'something went wrong', [], 401)
            }
        }
        return responseCode(res, true, 'Invalid user', [], 401)
    } catch (err) {
        return responseCode(res, true, err.message, [], 401)
    }
}


const downloadCsv = async (req, res) => {
    console.log("doewnload")
    if (!req.headers.authorization) {
        return responseCode(res, true, 'please provide token', [], 401)
    }
    try {
        const email = jwt.verify(req.headers.authorization, JWT_SECRET_KEY)
        const user = await User.findOne({ email }).select('_id')
        if (user) {
            try {
                const transaction = await Transaction.find({ userId: user._id }).sort('-createdAt')
                    .populate({ path: 'categoryId', select: ['type', 'title'] })
                // .populate('categoryId')
                const transactionObj = []
                transaction.forEach(data => {
                    const { _doc } = data
                    console.log(_doc)
                    _doc.categoryTitle = _doc.categoryId.title
                    _doc.categoryType = _doc.categoryId.type
                    _doc.categoryId = _doc.categoryId._id
                    transactionObj.push(_doc)
                })
                const csv = new ObjectsToCsv(transactionObj)
                await csv.toDisk('transactionReport.csv')
                return res.download('./transactionReport.csv', () => {
                    fs.unlinkSync('./transactionReport.csv')
                })
            } catch (err) {
                return responseCode(res, true, 'something went wrong', [], 401)
            }
        }
        return responseCode(res, true, 'Invalid user', [], 401)
    } catch (err) {
        return responseCode(res, true, err.message, [], 401)
    }
}

const downloadImage = async (req, res) => {
    const options = {
        url: 'https://www.google.com/images/srpr/logo3w.png',
        dest: '../../'                // will be saved to /path/to/dest/image.jpg
    }
    imageDownload.image(options)
        .then(({ filename }) => {
            console.log('Saved to', filename)  // saved to /path/to/dest/image.jpg
            res.download(filename,()=>{
                fs.unlinkSync(filename)
            })
        })
        .catch((err) => console.error(err))
}


module.exports = { newTransaction, getTransactions, downloadImage, downloadCsv }