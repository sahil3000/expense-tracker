const express = require('express')
const { newTransaction, getTransactions, downloadImage, downloadCsv } = require('../controller/transactionController')
const router = express.Router()

router.post('/new',newTransaction)
router.get('/',getTransactions)
router.get('/downloadCsv',downloadCsv)
router.get('/download',downloadImage)

module.exports= router;