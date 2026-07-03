

import Expense from '../models/expenseSchema.js';

// Add a new expense
// POST /api/expense
const addExpense = async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;

        const expense = await Expense.create({
            userId: req.user.id,
            title,
            amount,
            category,
            // if the user provides a date, use it.Otherwise, default to today 
            date: date || Date.now()
        });

        res.status(201).json(expense);



    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'failed to add to expense'});
    }
}



// GET api/expense
const getExpense = async (req, res) => {
    try {
        // get filter queries from the Url
        const { filter, startDate, endDate } = req.body; 
         //filter by logged in user
         let query = { userId: req.user.id };

         // Add date filter if user requested them 

         if (filter ==='past week') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            query.date = { $gte: oneWeekAgo }; //Greater than or equal to 7days

         } else if (filter === 'last month' ) {
            const oneMonthAgo = new Date();
            oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
            query.date = { $gte: oneMonthAgo }; //Greater than or equal to 30days

         } else if (filter === 'last 3 months' ) {
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setDate(threeMonthsAgo.getDate() -90);
            query.date = { $gte: threeMonthsAgo }; //Greater than or equal to 90 days

         } else if (filter === 'custom range' && startDate && endDate ) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)

            };
         }

         // Execute the query 
         const expenses = (await Expense.find(query)).sort({ date: -1 }); 

         res.status(200).json(expenses);




    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Server error'});
    }
};


// update an expense  ||  PUT /api/expense/:id
const updateExpense = async (req, res) => {
    try{
        const expense = await Expense.findById(req.params.id);
        // check if expense exists
        if(!expense) {
            return res.status(404).json({ message: 'Expense not found'});
        }
        // Make sure the logged in user is the owner of this expense 
        if(expense.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized"});
        }

        //update it
        const updateExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updateExpense);

    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Server error'});
    }
}


const deleteExpense = async (req, res) => {
    try{
        const expense = await Expense.findById(req.params.id);

        //check if expense exists
        if(!expense) {
            return res.status(404).json({ message: "Expense not found"});
        }
        // Make sure the logged in user is owner of this expense 
        if(expense.userId.toString() !== req.user.id ) {
            return res.status(401).json({ message: "Not authorized"});
        }

        //delete it
        await expense.deleteOne();
        res.status(200).json({ id: req.params.id, message: "Expense deleted successfully"});

        
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Server error'});
    }
}