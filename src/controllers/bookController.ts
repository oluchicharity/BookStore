import express from 'express';
import { Request, Response } from 'express';
import Book from '../models/bookModel'; 

export const addBook = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extract book details from request body
        const { title, author, genre, description, price } = req.body;

        // Check if book with the same title already exists
        const existingBook = await Book.findOne({ title });
        if (existingBook) {
            res.status(400).json({ error: 'Book with the same title already exists' });
            return;
        }

        // Create a new book 
        const newBook = new Book({
            title,
            author,
            genre,
            description,
            price
        });

        // Save the new book to the database
        const savedBook = await newBook.save();

        res.status(201).json({ message: 'Book added successfully', book: savedBook });
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getAbook= async (req: Request, res: Response): Promise<void> => {
    try {

    const bookId= req.params.id

    const book= await Book.findById(bookId)

    if(!book){
        res.status(404).json({ error: 'This book does not exist'});
        return; 
    }

    res.status(200).json(book);
        
    } catch (error) {
        console.error('Error getting this book:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export const getAllBooks= async (req: Request, res: Response): Promise<void> => {
    try {
   
        const books= await Book.find()

        if(!books){
            res.status(404).json({ error: 'No books found'});
        return; 
        }
        res.status(200).json(books);
    
    } catch (error) {
        console.error('Error getting books:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



export const updateBook = async (req: Request, res: Response): Promise<void> => {
    try {
        
        const bookId = req.params.id

        // Extract updated book details from request body
        const { title, author, genre, description, price } = req.body;

        // Find the book by ID in the database
        const existingBook = await Book.findById(bookId);

        // Check if the book exists
        if (!existingBook) {
            res.status(404).json({ error: 'Book not found' });
            return;
        }

        // Update the book fields
        existingBook.title = title || existingBook.title;
        existingBook.author = author || existingBook.author;
        existingBook.genre = genre || existingBook.genre;
        existingBook.description = description || existingBook.description;
        existingBook.price = price || existingBook.price;

        // Save the updated book to the database
        const updatedBook = await existingBook.save();

        // Return the updated book as a response
        res.status(200).json(updatedBook);
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const deleteBook = async (req: Request, res: Response): Promise<void> => {
    try {
        
        const bookId:string = req.params.id

        if(!bookId){
            res.status(400).json({ error: 'Book ID is required' });
            return 
        }
        
        const deletedBook= await Book.findByIdAndDelete(bookId)

        if(deletedBook){
            res.status(200).json({message:'deleted successfully', deletedBook})
        }else{
            res.status(404).json('book not found')
        }
        
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


