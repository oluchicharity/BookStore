import express from 'express'

const router= express.Router()

import { addToCart, reduceQuantityInCart, viewCart } from '../controllers/cartController'

import { authenticateUser } from '../middlewares/authentication'


router.post('/addCart', authenticateUser, addToCart)

router.put('/reduceQuantity/:id', authenticateUser, reduceQuantityInCart)

router.get('/viewCart', authenticateUser, viewCart)



export default router