import mongoose, { Schema, Document } from 'mongoose';

interface IBook extends Document {
    title: string;
    author: string;
    genre: string;
    description: string;
    price: number;
   
}

const BookSchema: Schema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    
});

const Book = mongoose.model<IBook>('Book', BookSchema);
export default Book;
