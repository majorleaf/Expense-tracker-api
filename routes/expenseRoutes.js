import express from 'express';
import { addExpense, getExpense, updateExpense, deleteExpense } from '../controller/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
 
// main path route /api/expense

router.route('/')
    .get(protect, getExpense)
    .post(protect, addExpense);


    // specific Id routes /api/expense/:id
router.route('/:id')
    .put(protect, updateExpense)
    .delete(protect, deleteExpense);


    export default router;