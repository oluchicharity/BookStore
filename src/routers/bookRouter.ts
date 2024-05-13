import express from 'express'

const router= express.Router()

import { addBook } from '../controllers/bookController'

import { authenticateUser } from '../middlewares/authentication'

router.post('/addBook', authenticateUser, addBook)

export default router