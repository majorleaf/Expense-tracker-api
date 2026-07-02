import express from 'express';
import { registerUser, loginUser }  from '../controller/authController.js';

const router = express.Router();


// route to register a user
router.post('/register', registerUser);

//route to login a user
router.post('/login', loginUser);

export default router;