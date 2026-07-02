import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required:true
    },
    category: {
        type: String,
        // 'enum' restrict the category to ONLY these exact strings
        enum: ['Groceries', 'Leisure', 'Electronics', 'Utilities', 'Clothing', 'Health', 'Others'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
});

const Expense = mongoose.model("Expense", expenseSchema) || mongoose.models.expenseSchema;

export default Expense;