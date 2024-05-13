import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ConnectOptions } from 'mongoose';
 import userRouter from './routers/userRouter';
 import bookRouter from "./routers/bookRouter"
 import cartRouter from "./routers/cartRouter"
import dotenv from 'dotenv'

dotenv.config()

const app: Application = express();
const PORT = process.env.PORT || 1234;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to BookStore');
});

app.use(express.json());


 app.use('/api/v1', userRouter,bookRouter,cartRouter);


const mongodb = 'mongodb+srv://agbakwuruoluchi29:XjrsTUWxbFVSGNJ0@cluster0.tffuwpj.mongodb.net/BookStore';
mongoose.connect(mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true
} as ConnectOptions).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// XjrsTUWxbFVSGNJ0