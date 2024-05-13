import express from 'express'

const router= express.Router()

import { addBook, deleteBook, getAbook, getAllBooks, updateBook } from '../controllers/bookController'

import { authenticateUser } from '../middlewares/authentication'

router.post('/addBook', authenticateUser, addBook)

router.get('/getOneBook/:id', getAbook)

router.get('/getAllBooks', getAllBooks)

router.put('/updateBook/:id',authenticateUser, updateBook)

router.delete('/deleteBook/:id', authenticateUser, deleteBook)


export default router