
import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem extends Document {
    bookId: string;
    quantity: number;
}

const CartItemSchema: Schema = new Schema({
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, 
    quantity: { type: Number, default: 1 } 
});

const CartItem = mongoose.model<ICartItem>('CartItem', CartItemSchema);
export default CartItem;
