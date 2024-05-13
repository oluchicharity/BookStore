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
