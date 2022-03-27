const express = require('express');
const router = express.Router()
const { addCategory, getAllCategories, getCategory, updateCategory, deleteCategory } = require('../controller/categoryController');

router.post('/add',addCategory);
router.get('/',getAllCategories);
router.get('/:categoryId',getCategory);
router.put('/update',updateCategory);
router.delete('/delete/:categoryId',deleteCategory);
module.exports = router