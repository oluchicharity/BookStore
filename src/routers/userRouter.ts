import express from 'express';
import { getAllUsers, getOne, loginUser, registerUser, updateUser } from '../controllers/userController';
import { loginValidationRules, registerValidationRules } from '../validator/validator';

const router = express.Router();

router.post('/register', registerValidationRules(), registerUser );

router.post("/login", loginValidationRules(), loginUser )

router.get("/getOne/:id",getOne )

router.get("/getUsers",getAllUsers)

router.put('/updateUser/:id', updateUser)



export default router;

