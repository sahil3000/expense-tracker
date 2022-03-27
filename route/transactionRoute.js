const express = require('express')
const { newTransaction, getTransactions } = require('../controller/transactionController')
const router = express.Router()

router.post('/new',newTransaction)
router.get('/',getTransactions)

module.exports= router;