import express from "express";
import { createTransaction, deleteTransaction, editTransaction, getTransactions } from "../controllers/transactionController.js";
import {auth} from "../middleware/auth.js";

const router = express.Router();

//Route 1 : Create transaction
router.post('/create', auth, createTransaction);

//Route 2 : Get all transactions
router.get('/get', auth, getTransactions);

//Route 3 : Edit transactions
router.patch('/edit/:id', auth, editTransaction);

//Route 4 : Delete transaction
router.delete("/delete/:id", auth, deleteTransaction);

export default router;