
import CartItem from '../models/cartItems'; 

import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
    user?: any; 
}

export const addToCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        
        const { user } = req;
        if (!user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const {  bookId, quantity } = req.body;

        if ( !bookId || !quantity || quantity <= 0) {
            res.status(400).json({ error: 'Invalid input data' });
            return;
        }

        // Check if the book is already in the user's cart
        let cartItem = await CartItem.findOne({  bookId });

        if (cartItem) {
            // If the book is already in the cart, update the quantity
            cartItem.quantity += quantity;
        } else {
            // If the book is not in the cart, add it as a new item
            cartItem = new CartItem({  bookId, quantity });
        }

        // Save the cart item to the database
        await cartItem.save();

        res.status(200).json({ message: 'Book added to cart successfully', cartItem });
    } catch (error) {
        console.error('Error adding book to cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const reduceQuantityInCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const  cartItemId  = req.params.id

    
        if (!cartItemId) {
            res.status(400).json({ error: 'Invalid input data' });
            return;
        }

        let cartItem = await CartItem.findById(cartItemId);

        if (!cartItem) {
            res.status(404).json( 'Cart item not found' );
            return;
        }

        // Decrement the quantity if it's greater than 1
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        } else {
            // If the quantity is already 1, remove the item from the cart
            await CartItem.findByIdAndDelete(cartItemId);
            res.status(200).json( 'Cart item removed successfully' );
            return;
        }

        // Save the updated cart item
        await cartItem.save();

        res.status(200).json({ message: 'Cart item quantity reduced successfully', cartItem });
    } catch (error) {
        console.error('Error reducing cart item quantity:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



export const viewCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { user } = req;
        if (!user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const cartItems = await CartItem.find();
    

        res.status(200).json({ cartItems });
    } catch (error) {
        console.error('Error viewing cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


