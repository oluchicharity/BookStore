import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User, { IUser } from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()


export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
     res.status(400).json({ errors: errors.array() });
      return; 
    }

    const { fullname, email, password } = req.body;

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);
    
   // console.log('Hashed password:', hashedPassword);

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Email already exists' });
      return; 
    }

    // Create a new user
    const newUser: IUser = new User({ fullname, email, password: hashedPassword });
    const savedUser = await newUser.save();
    
    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return; 
      }
  
      const { email, password } = req.body;
  
      // Find the user by email
      const user: IUser | null = await User.findOne({ email });
  
      // Check if the user exists
      if (!user) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }
  
      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }
  
      // Passwords match, login successful
      const secretKey = process.env.SECRET;

    if (!secretKey) {
    throw new Error('SECRET key is not provided');
     }
     // Generate JWT token 
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '5h' });

      // Exclude password field from user object in response/ sanitize
      const userWithoutPassword = { ...user.toJSON(), password: undefined };
  
      res.status(200).json({ message: 'Login successful', user: userWithoutPassword, token });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  export const getOne = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;

        // Query the database for the user by ID
        const user: IUser | null = await User.findById(userId);

        // Check if the user exists
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return; 
        }

        // If user found, send it in the response
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


  export const getAllUsers = async (): Promise<IUser[]> => {
      try {
          const allUsers: IUser[] = await User.find();
          return allUsers;
      } catch (error) {
          console.error('Error retrieving all users:', error);
          throw new Error('Failed to retrieve all users');
      }
  };


export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user ID from request parameters
    const userId: string = req.params.id;

    // Extract updated user data from request body
    const { fullname, email}: Partial<IUser> = req.body;

    // Check if user ID is provided
    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    if(!fullname ||email){
        res.status(400).json('please choose what you would like to update')
    }
    const updatedUser = await User.findByIdAndUpdate(userId, { fullname, email }, { new: true });

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {

    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const deleteUser = async (req:Request, res:Response): Promise<void> =>{
    try {

        const userId:string = req.params.id

        if(!userId){
            res.status(400).json({ error: 'User ID is required' });
            return 
        }
        
        const deletedUser= await User.findByIdAndDelete(userId)

        if(deletedUser){
            res.status(200).json({message:'deleted successfully', deletedUser})
        }else{
            res.status(404).json('user not found')
        }
        
    } catch (error) {
        console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    }
}